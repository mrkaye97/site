---
title: "My newfound love for Obsidian"
description: "And how it consolidated a bunch of things in my life"
date: "2026-10-24"
tags: ["lifestyle", "engineering"]
hidden: true
---

A few years ago, I found out about [Obsidian](https://obsidian.md/) because I noticed a cool logo on my coworker's screen while she was screen sharing during an interview, so I went perusing to find out what it was. I downloaded it, wrote my first note, and fell into a trap right away.

I spent a bunch of time thinking how I could use cool features like note linking, daily notes, etc. I set up a whole organizational system, where I had folders for things like meetings, because I told myself I wanted to start taking notes in them. Obviously, this didn't stick. I'd never taken notes in meetings before, and no force in the universe could make me start now, not even Obsidian. And so Obsidian was forgotten, cast away and unused for the greater part of two years.

Then I started [self hosting](./self-hosting.md) things, and over time I began to realize that a shared notes app with additional functionality, like the ability to run JavaScript snippets, could help me consolidate a bunch of things: My grocery lists and other scratch notes, which I was using [Memos](https://usememos.com/) for, [Hevy](https://www.hevyapp.com/), which I was using to track my workouts, an app I'd built for tracking phone calls with friends, and another for tracking recipes. Obsidian was back.

Ironically (maybe as I should've expected), I'm not using any of Obsidian's "cool" features or any productivity plugins or anything like that. Instead, I have a couple of simple templates for things like new workouts and notes from calls with friends, and I have some Clipper templates configured for importing recipes and blog posts I like into my vault. Otherwise, I'm just mostly writing simple notes and organizing them in a sane way.

### Workouts

My workout templates replaced Hevy. I've been doing a pretty simple two-day split (since I'm only going to the gym twice a week if I'm lucky, since it's cycling season), and each one is a [Templater](https://github.com/SilentVoid13/Templater) template that's mostly just a list of exercises:

```js
const rotatingMainLifts = [
  { name: "Front Squat" },
  {
    name: "Bench Press",
    variants: ["Incline Bench Press (Barbell)", "Close Grip Bench Press", "Bench Press (Dumbbell)"],
  },
];

const exercises = [
  { name: "Ab Roller", superset: "Warm-up A", sets: 3 },
  { name: "Box Jump", sets: 3 },
  { slot: "main", sets: 5, rest: "2:30" },
  { slot: "secondary", superset: "1a", sets: 3 },
  {
    name: "Pull-up",
    superset: "1b",
    sets: 3,
    variants: ["Chin Up", "Lat Pulldown (Cable)"],
  },
  // ...
];

tR += await tp.user.buildWorkout(tp, "Day A", exercises, rotatingMainLifts);
```

All the logic lives in a `buildWorkout` script. It moves the new note into my workouts folder, checks which of the two main lifts I did as my main lift last time and swaps them, asks me which variant I want for any exercise that has them, and pre-fills every set with what I did last time. The resulting note is just a checklist:

```md
## Bench Press

_Rest 2:30 between sets_
_Last: 2026-09-22_

- [x] 155 x 5
- [x] 155 x 5
- [x] 155 x 5
- [x] 155 x 5
- [x] 155 x 5

Notes:
```

At the gym, I bump the weights if I need to and check off sets as I go. This is pretty similar to the functionality I got from Hevy before. Although I definitely lose some features, it's been working great for me and is a dead-simple way for me to keep track of things without needing to pay for an expensive subscription to an app with a bunch of features I don't really need. It also is totally customizable, which has been an issue for me in the past (e.g. Runna's workout planner / tracker is missing a ton of normal exercises).

### Recipes

My recipes come in through the [Obsidian Web Clipper](https://obsidian.md/clipper). Most recipe sites embed [schema.org Recipe](https://schema.org/Recipe) data in the page, so my clipper template triggers on that schema and pulls the ingredients and instructions out directly. The clipper can also run prompts against the page through an LLM, which I use to tag each recipe with properties I can filter on later:

```jsonc
{
  "name": "Recipe",
  "path": "Recipes",
  "triggers": ["schema:@Recipe"],
  "properties": [
    { "name": "author", "value": "{{schema:@Recipe:author.name}}", "type": "text" },
    {
      "name": "cuisine",
      "value": "{{\"The recipe's cuisine as exactly one of: Italian, American, French, ... Reply with only the label.\"}}",
      "type": "text"
    },
    {
      "name": "time_minutes",
      "value": "{{\"Total time to make this recipe in minutes as a plain integer with no units and no other text\"}}",
      "type": "number"
    },
    { "name": "source", "value": "{{url}}", "type": "text" },
    { "name": "last_made", "value": "", "type": "date" }
    // ...
  ],
  "noteContentFormat": "## Ingredients\n\n{{schema:@Recipe:recipeIngredient[*]|list}}\n\n## Instructions\n\n..."
}
```

One click on a recipe page gives me a note like this:

```yaml
---
tags:
  - recipe
author: "Christian Reynoso"
cuisine: "Italian"
meal: dinner
time_minutes: 35
source: "https://cooking.nytimes.com/recipes/1025675-pesto-beans"
dietary:
  - "vegetarian"
keywords:
  - "easy"
  - "one-pot"
  - "quick"
  - "weeknight"
last_made: 2025-09-15
---
```

Then a [Base](https://help.obsidian.md/bases) over the `Recipes` folder works as my recipe app: I can filter by cuisine or cook time, or sort by what I haven't made in a while.

I think my original Obsidian attempt failed because it was a solution in search of a problem, and I thought all the plugins and features were _neat_, but I didn't really need them for anything in my day-to-day. Now it's the opposite. I had a zillion problems with their own solutions, and it's been wonderful how Obsidian has consolidated those (and saved me a bunch of money on subscriptions in the meantime!).