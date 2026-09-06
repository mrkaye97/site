---
title: "On SDK Design"
description: "Lessons learned from bringing the Hatchet SDK to the point where I would be excited to use it"
date: "2026-01-08"
tags: ["engineering"]
original: "https://hatchet.run/blog/sdk-design"
---

In the ten or so years that I've been programming, there have only been a handful of libraries that I've truly enjoyed using. When I started at Hatchet, our Python SDK wasn't one of them. Documentation was sparse, method names were cryptic, using the SDK felt clunky and unintuitive, and it was often unclear why something I would try would not work or would silently fail (e.g. supplying a timestamp parameter as an ISO-formatted string vs. a Unix epoch - more on this later). I've especially loved working with FastAPI, as well as some other popular libraries like TanStack (React) Query, and wanted to take some inspiration from them in rebuilding our SDK.

At Hatchet, we treat our SDKs as part of our frontend, since they're usually the first entrypoint into Hatchet for a new user, and they're where our customers spend most of their time interacting with the product. To borrow an overused UX design term: We want using our SDKs to be a delightful experience.

For us, "delightful" means a few things:

1. **Make it make sense** - Can a developer understand what's happening without reading the manual?
2. **Be opinionated to nudge developers towards the happy path** - As developers build more complex systems, guide them toward patterns that will scale and succeed.
3. **Teach along the way** - Provide the resources developers need to grow.

:::note
For the majority of this post, I'll focus on Hatchet's Python SDK. We currently provide SDKs in Python, Go, and TypeScript.
:::

## 1. Make it make sense

As I've [written](/hatchet/sdk-design/blog/task-queue-modern-python) [about](/hatchet/sdk-design/blog/fastapi-background-jobs-to-hatchet) [before](/hatchet/sdk-design/blog/warning-event-loop-blocked), our Python SDK takes significant inspiration from existing titans in Python application tooling: [FastAPI](https://fastapi.tiangolo.com/), [Pydantic](https://docs.pydantic.dev/latest/), [Celery](https://docs.celeryq.dev/en/main/getting-started/introduction.html), and more.

A very large proportion of potential Hatchet users in Python will have worked with either FastAPI or Celery before in some capacity. We see a lot of value in drawing inspiration from these tools: One of our goals in designing our Python SDK was to make it feel natural for a FastAPI developer (and pretty natural for a Celery developer) who had never worked with Hatchet before, by using similar patterns to what you'd find in those other settings.

Because of this, defining tasks in Hatchet looks like this:

```python
@hatchet.task()
async def do_something_async(input: MyInputModel, ctx: Context) -> MyOutputModel:
    await something()

    return MyOutputModel(...)
```

If you've worked in FastAPI, this feels almost identical to defining a route:

```python
@app.post()
async def do_something_async(body: MyPostBody) -> MyPostResponse:
    await something()

    return MyPostResponse(...)
```

And this is intentional — it lets a new Hatchet developer go from zero to one with very little need to reference documentation or grapple with new concepts and vocabulary.

Hatchet's Python SDK also provides a number of other familiar features, like [dependency injection](https://docs.hatchet.run/home/dependency-injection) and [lifespans](https://docs.hatchet.run/home/lifespans), which similarly give new Hatchet developers coming from FastAPI the same toolbox they already know and love.

## 2. Follow the happy path

Familiarity gets developers in the door, but being opinionated is critical for helping developers build products with Hatchet that will grow with them, as opposed to becoming maintenance headaches.

As developers and teams deepen their Hatchet adoption, they'll encounter problems they haven't seen before (or have seen in different contexts like Celery or Temporal but aren't sure how to implement with Hatchet). Rather than forcing developers to wade through documentation or other resources to make informed decisions, our SDK gently nudges them toward the _happy path_: approaches to solving problems that we've found are relatively straightforward to implement, and scale well over time. We achieve this in a number of ways.

### Be opinionated

We've had a lot of success making the SDK _opinionated_, so that it's clear there's often a preferred way of doing things, like triggering tasks or describing input types.

For instance, we strongly encourage using Pydantic to validate the types of task inputs and outputs, and we make this very clear in the documentation, likely to the point where a new Hatchet developer wouldn't know that using Pydantic is not actually required. We do this because we believe in the importance of type safety and static type checking. This helps rule out classes of bugs caused by, for example, passing untyped dictionaries into and out of tasks and making implicit assumptions about what data is present.

Similarly, we provide helper methods that reinforce type safety, such as the various `run` methods on the `Workflow` and `Standalone` classes, which allow users to trigger jobs in a type-safe way. While it's technically possible to trigger runs in Hatchet using the REST API via the `hatchet.runs.create` method (which takes a workflow name and an input), this is not our recommended path, so we discourage it by not including that method in many places in the documentation or examples.

### Provide hints

Another thing we do to help developers stay on our happy path is providing hints when things go wrong. One of the most common issues we see in Python is the infamous [blocked event loop](/hatchet/sdk-design/blog/warning-event-loop-blocked), so we try to give the user a (loud) hint about what might be going wrong via the logs to help them debug. Without this hint, tasks will grind to a halt for seemingly no reason. With it, developers can make a choice to either run their blocking code sync or dig into where the event loop blockage is coming from (we encourage running almost everything as async, if possible).

```python
@hatchet.task()
async def block(_i: EmptyModel, _c: Context) -> None:
    time.sleep(10)  # blocking
```

When this runs, you'll see a clear warning in your logs:

```
THE TIME TO START THE TASK RUN IS TOO LONG, THE EVENT LOOP MAY BE BLOCKED. See https://docs.hatchet.run/blog/warning-event-loop-blocked for details and debugging help.
```

### Write wrappers

Our SDKs ship with "feature clients," which are wrappers of our REST API that group similar operations (e.g., listing workflow runs, getting a run, etc.) under a shared umbrella. These allow us to abstract away some complexity of working with our APIs by providing friendlier and/or more opinionated interfaces to developers. For instance, to get the result of a run, you can either run it "fire-and-wait" style:

```python
result = await my_workflow.aio_run()

print(result) # the result of the workflow run
```

or you can run it "fire-and-forget" style, and use the `WorkflowRunRef` to access the result later:

```python
ref = await my_workflow.aio_run_no_wait()

# .. do some things here ..

result = await ref.aio_result()
```

This is a trivial example, but the general principle for more complicated ones is the same: Write wrappers to turn complicated commonly-performed operations into trivial ones.

To tie back to the first section, we also write wrappers that push developers toward our happy path. For instance, many of our `list` API wrappers (which list runs, events, etc.) internally handle pagination if you want to list entities over a long time range, since we know that query performance on the Hatchet engine is significantly improved by smaller time windows (because of [how our database is partitioned](/hatchet/sdk-design/blog/postgres-partitioning/)). Similarly, we have wrapper methods for replaying large numbers of task runs in bulk, to keep pressure off our API and allow developers to perform this action without intervention from us.

All of this makes the SDK seem to "just work" (at least more often) for developers, so they can stay focused on delivering value and not be bogged down by minutiae that's likely not very important to them.

## 3. Teach along the way

Even the best guardrails can't anticipate every scenario. At some point, every developer will have a question that's not covered well by documentation, hit an edge case, need to debug unexpected behavior, or want to understand _why_ something works the way it does. To manage these scenarios, we try our best to make our SDKs _self-documenting_ and _well-documented_, and we provide other educational content, via long-form documentation, our blog, examples, and so on.

### Self-documenting

As our team knows, I'm a proponent of verbose names. For instance, we have a method I mentioned earlier for replaying large batches of tasks in bulk, which is called `aio_bulk_replay_by_filters_with_pagination` in the SDK. Verbose? Absolutely. But the name is also clear to someone who knows what "replay" and "filters" mean in this context — and they should, as they're common concepts in Hatchet. As the name suggests, this is the `async` version of this method. It lets you replay a large number of tasks in bulk, deciding which tasks to replay based on a set of filters, and uses pagination to ensure the API doesn't get overloaded. It's a lot to convey in a name!

Similarly, we rely heavily on type hints to help developers understand what each parameter to a method like this is intended to do. For instance, `since` and `until` are `datetime` objects that control the time window we're looking for tasks to replay in. This sounds trivial, but too many Python libraries haven't adopted type hints for parameters like this. Without them, a parameter called `since` could reasonably be represented by a `datetime`, an integer representing an epoch (in seconds, milliseconds, or nanoseconds), or a string like an ISO-formatted timestamp. I've wrestled with enough 4XX (or sometimes 5XX) error codes from APIs that accept ambiguous parameters to understand the frustration that comes with not knowing what shape a date object needs to be in. We found it important to avoid that.

For example, to list runs:

```python
# invoked via hatchet.runs.list
def list(
    since,
    statuses,
    ...
):
```

With type hints:
```python
# invoked via hatchet.runs.list
def list(
    since: datetime | None = None,
    statuses: list[V1TaskStatus] | None = None,
    ...
) -> V1TaskSummaryList:
```

Again, it's a trivial change, and over time more and more Python libraries have begun to include type hints, but it should go without saying that narrowing the space of possibilities for the types of the parameters being passed to this `list` method makes it easier on developers who are trying to work with the SDK. In some ways, this is a quirk of Python and other dynamically typed, interpreted languages. But there's also an important difference between using `datetime` here (or something like `time.Duration` in Go), vs. using `str` or `int` to represent the same data, which is also less specific and less helpful.

### Well-documented

The other side of the coin is _well-documented_, which is largely self-explanatory: We try to provide helpful documentation in the form of docstrings, examples, and long-form documentation that developers can reference when a function signature isn't enough to answer their question.

Importantly, we (humans) write all of our documentation. Writing our own documentation is important to us because we believe in building trust and credibility, and we've found that incorrect (read: hallucinated) documentation has a tendency to send developers down rabbit holes full of frustration and confusion when something the documentation says should work does not. It's been [a challenge to keep our documentation up to date](/hatchet/sdk-design/blog/automated-documentation), but we feel strongly that the time investment in approachable, correct, human-written documentation is worth it.

### Other education

Since you're here, you know we also maintain a blog! Our blog seeks to educate on concepts that are more in-depth and relevant to Hatchet, task queues, distributed systems, language features like event loops, and more. We often reference our blog as an "answer" to a question—such as in the noisy warning you'll see if you're blocking the event loop—so that there's a clear place to start reading and debugging or, if event loops are new to you, learning about them.

## The through line

These three principles - familiarity, opinionated guidance, and continuous learning - aren't isolated design choices. Instead, they're our way to convey to Hatchet developers that we care about them and their time, and we want them to love working with Hatchet.

When an SDK makes sense from the first line of code, developers don't waste hours hunting through documentation. When it nudges them toward making decisions that will scale, they avoid refactoring nightmares six months down the line. And when it teaches along the way, teams grow their expertise instead of depending on tribal knowledge, hacks, or support tickets.
