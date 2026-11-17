---
title: "Supertoast, Redux"
description: "Now we just truncate our supertoast table every day"
date: "2026-11-17"
tags: ["engineering"]
original: "https://hatchet.run/blog/supertoast-wasnt-enough"
---

Everything is S3 now. [Postgres](https://neon.com/blog/get-page-at-lsn), [Git](https://cursor.com/blog/git-at-any-scale), [Kafka](https://www.warpstream.com/blog/kafka-is-dead-long-live-kafka), and even [POSIX filesystems](https://docs.archil.com/details/architecture) are being reinvented with S3 as a foundational layer. Earlier this year, we hopped on the bandwagon and decided to offload a large part of the Hatchet payload data to S3 to save us money on disk, which we wrote about in a blog we called [Supertoast Tables](/blog/supertoast-tables). Our Postgres disk costs were getting out of control, so offloading the data to S3 after a day instead of keeping it on disk indefinitely could help shed terabytes of data.

But a few months after we wrote this, we realized we could do even better. We now have a new version of the same job that offloads the same hundreds of gigabytes of data to S3 every day, but gives us something like a 97% reduction in disk usage. And in the process, we also learned a few fun, lesser-known tricks in Postgres that were great for solving exactly this type of problem.

## A Recap

Let's rewind. The original idea used a nightly job to rewrite a partition of our payloads table (we [heavily use time-based partitioning](https://hatchet.run/blog/postgres-partitioning) in Postgres). We'd process blocks of rows, offload them to S3, and then write a pointer to the key in S3 into a new partition. Once we'd offloaded every row to S3, we'd acquire a lock on the parent, detach the old partition with the inline content, and attach the new one with the pointers. This went incredibly well; we scaled down a bunch of our NVMes, rewarding ourselves with a glass of champagne.

But the champagne soon ran dry. A few months in, we hit a new problem: we wanted to save even more room on disk. But even with the new partitions only containing a pointer, many of the offloaded partitions were taking up hundreds of gigabytes each. Half of this was from the actual data: The keys, and other metadata we stored. The other half was from the primary key.

So we were faced with a new challenge: How can we continue offloading data to S3, but be able to look up the correct payload in S3 _without needing to store this key-value "supertoast" table with pointers to the objects_? And with that, our lookup-scan-lookup method was born.

## An Aside on Polymorphism in Postgres

Before we go further, a side note on one critical detail that makes all of this work: a supertoast row has the same id as the "source" row that owns its payload.

You might think of this as a type of polymorphism, but in the database. Many different source tables (tasks, events, etc.) each write their payloads into the same supertoast table, and we look up the relevant payload by using the id of e.g. the task that we're retrieving. Our friend [Laurenz Albe at Cybertec](https://www.cybertec-postgresql.com/en/author/laurenz_albe/) wrote a great [blog post](https://www.cybertec-postgresql.com/en/conditional-foreign-keys-polymorphism-in-sql/) on a few options for implementing polymorphism in Postgres, if you're curious.

Our schema looks something like this:

```sql
CREATE TABLE supertoast (
  id UUID PRIMARY KEY,   -- same as the id of the task, event, etc. that owns it
  content JSONB NOT NULL -- the payload
);

CREATE TABLE task (
  id UUID PRIMARY KEY,   -- also this task's supertoast id (no FK constraint)
  priority SMALLINT NOT NULL,
  queue TEXT NOT NULL
);

CREATE TABLE event (
  id UUID PRIMARY KEY,   -- same idea
  seen_at TIMESTAMPTZ NOT NULL,
  scope TEXT
);
```

The point here is that in doing this, we never have to store a payload's id anywhere. Even after the supertoast row is gone and the payload lives only in S3, we still know its id, because it's the id of the task or event we're looking at.

:::warning
I feel obligated to say that I would _very strongly not recommend using this pattern in your own application!_ If you need polymorphism, it's almost certainly safer to use one of the options that Laurenz described in his post. We have a tendency to break some "rules" in the name of performance and optimization at scale.
:::

## Magic Lookups

We started brainstorming ways for us to limit how much data we needed to write to disk while still being able to look up payloads correctly. Our first thought was to try using a hash index instead of a btree for the primary key of the key-value table to limit how much disk the index was taking up, but it was immediately clear that this wouldn't be enough. We needed an order-of-magnitude improvement, and this wouldn't give us anything close to that.

Next, we started toying with the idea of a "magic" lookup, which was basically some way to map from the supertoast row's UUID to a key in S3, _without needing to write that key to the database_. The simplest magic lookup would be storing each payload as its own key in S3, but as we discussed in the last article, the volume of PUT requests becomes prohibitively expensive at scale. The S3 objects need to contain batches of many payloads, not just a single payload.

Which brought us to the next idea: during the offload process, we'd write an index file which contains a mapping from a UUID to its actual key, and second, the object itself (at that key).

## The Index File

With that in mind, the index file that we write to S3 looks like this:

```
4b03029c-5a3f-4c95-b601-1ff755baaa0a -> s3://bucket/2026/11/03/10/foobar.json
e81d076b-a88b-407d-aeb4-fc6fa7e0ae05 -> s3://bucket/2026/11/03/10/bazqux.json
```

The idea was that if we could write a file like this, and then come up with a way to identify the correct index file to look for a specific payload in without needing to write a pointer to the database for each payload row, we'd be golden. And thanks to the id trick above, we always know which id to look for.

## Our Initial Idea

Our first idea was to try to group payloads by the first N characters in the UUIDs identifying them. Note that we mostly use UUIDv4, so be kind to us instead of telling us that UUIDv7 would solve all of our problems (we know...).

We thought that if we, for example, took the first four or five characters of the supertoast row's id and wrote all rows with those first four or five characters to an index file named with those same characters, then on read we could look at the first characters of the id, map it to the correct index file, and it'd work! For example, `4b03029c-5a3f-4c95-b601-1ff755baaa0a` would map to an index file called something like `4b03*.index`.

There's an obvious problem though: If we use this method, then the sizes of the index files are highly variable because some tenants might run hundreds or thousands of times more work than others. This means that high-volume tenants would have index files that are hundreds or thousands of times the size of low-volume tenants, making it hard to right-size those files (and also hard to control our spend).

It also just felt a little bit too magical. So we moved on, but felt like this was at least a step in the right direction.

## Partitioning the UUID Space

After thinking about it for a while, we had a realization: There's a fixed range of possible UUIDs, and UUIDs can't overlap, so maybe we could write the location of the _index file_ to the database, and describe the range of ids that it contains, and shrink the footprint of the payloads in the database for each day by a factor of whatever the size of the chunks we offload are.

The basic idea is pretty simple: Instead of writing a key in S3 for each supertoast row, we instead write a row into a new table, call it `supertoast_offload_index`, that has ranges of ids. When we go to offload a chunk of rows, we order by the ids and find the minimum and maximum UUID values in that chunk, and then we write those as the bounds on the index row. For example:

```sql
CREATE TABLE supertoast_offload_index (
  partition_date DATE NOT NULL,
  min_id UUID NOT NULL,
  max_id UUID NOT NULL,
  index_file_key TEXT NOT NULL,
  PRIMARY KEY (partition_date, min_id, max_id)
);
```

Then, on read we'd just look up the relevant row in `supertoast_offload_index`. Something like:

```sql
-- name: RetrieveIndexFile :one
SELECT index_file_key
FROM supertoast_offload_index
WHERE
    @payloadId::UUID > min_id      -- exclusive lower bound
    AND @payloadId::UUID <= max_id -- inclusive upper bound
```

This would give us back the key of the index file containing the row we want to look up. Then, we'd read the file, scan it to find the id we were looking for, read its corresponding key, and look up that key to retrieve the actual row. At this point, we felt like we were 90% of the way there, but there were some problems. For instance, how can we guarantee that no ranges of ids accidentally overlap?

## Partitioning with Range Types

With a bit of digging through the always-fantastic Postgres documentation, we stumbled across [range types](https://www.postgresql.org/docs/current/rangetypes.html), which seemed to solve exactly the problems we had. By using a range type, we'd get some nice behavior.

First, this meant we could create every UUID range as `(lower, upper]` (except the first, which includes zero), starting with `[00000000-0000-0000-0000-000000000000, << some real id >>]` and ending with `(<< some other real id >>, ffffffff-ffff-ffff-ffff-ffffffffffff]`. In the simplest case (only a single id), we'd have two ranges:

1. `[00000000-0000-0000-0000-000000000000, 4b03029c-5a3f-4c95-b601-1ff755baaa0a]`
2. `(4b03029c-5a3f-4c95-b601-1ff755baaa0a, ffffffff-ffff-ffff-ffff-ffffffffffff]`

These ranges have a critical property: For a given day, they form a _partition_ (in the mathematical sense) of the range of possible UUIDs. In other words, we have a guarantee that every possible UUID is contained in _exactly one_ of these UUID ranges, and that the ranges do not overlap.

Second, it became trivial to not only know that the ranges form a partition in theory, but enforce it via constraints. Postgres supports [exclusion constraints](https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRAINT) on range types, which gave us a very straightforward way to guarantee that our ranges do not overlap, and to reject any incoming row that contained an invalid range.

And finally, creating the bounds for the ranges was trivial as we paginated. All we'd need to do was keep track of the previous maximum UUID value (from the prior chunk we offloaded), and set it as the minimum bound for the next range, exclusive. This means that for every neighboring pair of ranges created, the second (upper) range of the pair starts with the ending value from the previous (lower) range in the pair, which, in conjunction with the exclusion constraint, gives us exactly the partitioning behavior we needed!

```sql
-- the exclusion constraint below requires btree_gist,
-- which is a trusted extension
CREATE EXTENSION btree_gist;

-- our custom uuid range type
CREATE TYPE uuidrange AS RANGE (
    SUBTYPE = UUID
);

CREATE TABLE supertoast_offload_index (
    -- uuid ranges are date-unique, meaning that no two ranges
    -- for the same day can overlap (since we offload partitions
    -- one day at a time)
    partition_date DATE NOT NULL,
    block_id_range uuidrange NOT NULL,
    index_file_key TEXT NOT NULL,
    CONSTRAINT supertoast_offload_index_partitioning_excl
        EXCLUDE USING GIST (partition_date WITH =, block_id_range WITH &&)
);
```

Now, we can write a query like this, to look up the correct row given the range:

```sql
SELECT
  @id::UUID AS id,
  index_file_key
FROM supertoast_offload_index
WHERE
    partition_date = @targetDate::DATE
    AND block_id_range @> @id::UUID
;
```

And get back the relevant index file! These ranges generally contain 10,000 UUIDs (rows), giving us a roughly four-orders-of-magnitude improvement in disk usage vs. the prior implementation where we stored the S3 keys directly.

Putting it all together, here's the lookup-scan-lookup path end to end:

<video controls muted playsinline preload="auto" style="border: 1px solid var(--rule)">
  <source src="/hatchet/supertoast-wasnt-enough/index-lookup-dark.mp4#t=0.001" type="video/mp4" media="(prefers-color-scheme: dark)" />
  <source src="/hatchet/supertoast-wasnt-enough/index-lookup-light.mp4#t=0.001" type="video/mp4" />
</video>

## Bonus Content: UUIDv7

If you read the previous code closely, you'd have noticed we need a `targetDate::DATE` to be able to figure out which rows to consider when looking for our index file. Because of the polymorphism I described before, this generally would mean we'd need to store e.g. the `inserted_at` of the _supertoast row_ alongside its id in the database, meaning two additional metadata columns for every row in the other tables (the task, event, etc.), just for lookups later.

This is where UUIDv7 is coming to the rescue for us. Since a v7 UUID encodes a timestamp, we can use that timestamp for 1) determining which partition to put the supertoast row on, and 2) for figuring out which date to look for it on after it's been offloaded. This saves us the need to write a separate column containing this information. Instead, the "foreign key" we write encodes both pieces of information we need: the id, and the date.

## Where Are We Now?

Nowadays, if you look at the partitions of our supertoast tables in our production databases, they're all empty! Once the offload job completes, we can just truncate the table instead of needing to write back the new one with all the keys. Effectively, this shrinks the disk footprint from storing payloads in our database down to 1/R relative to the original (pre-supertoast-v1) implementation where all payloads were stored inline, where R is the number of days of retention we guarantee. On most instances, this is a 97% reduction in disk usage of this table (30-day retention).

Since the original supertoast table only ended up giving us a 50% improvement or so, this also represents a dramatic improvement over that. Instead of needing to store a hundred-gigabyte primary key (plus the pointers to S3) for each day, we store nothing, at the cost of slightly slower cold-path payload lookups (one Postgres query plus two S3 GETs) that tend to be rare anyway.
