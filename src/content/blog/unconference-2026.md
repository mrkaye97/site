---
title: "Cognitive Biases"
description: "My 2026 'Unconference' Talk"
date: "2026-09-10"
tags: ["misc"]
hidden: false
---

At Hatchet, we've been developing something of a tradition during offsites that we've been calling an "Unconference." The idea is that each member of the team gives a short (think 20-30 minutes) talk on something of their choosing, which helps us get to know each other better and maybe learn something new in the process.

Past unconference talks have included a deep dive into a teammate's life story, a workshop on how to improve your writing, and the history of a prior startup. My last talk was on basic concepts in game theory: [The Prisoner's Dilemma](https://en.wikipedia.org/wiki/Prisoner%27s_dilemma), the [Stag Hunt](https://en.wikipedia.org/wiki/Stag_hunt), [Knife-Edge Equilibria](https://jrm-research.blogspot.com/2007/05/knife-edge-equilibrium.html), and how some of these basic games can apply to real-world situations.

This year, I'm giving my talk on philosophical razors and cognitive biases. I like giving "talks" that are mostly made up of exercises. Last year, we played the games to help everyone work through the decision-making for themselves, since game theory is ultimately about making decisions. This year, we did the same.

## Outcome Bias

I started by asking everyone to close their eyes, and then asking a question: Raise your hand if you believe that the outcome of a decision affects how good the decision was.

Then, we played two hands of Blackjack.

### Hand 1

```
1: 10 4
2: A 8
D: 6 (up) Q (hole)
```

Player 1 hits and gets 7 for 21.

Player 2 stands.

The dealer has to hit, and gets 4, for 20. Player 1 wins, player 2 loses.

Who made the better decision?

This is a trivial example, but the point here is that if you mean "correct by expectation" by "better," then Player 2 made the correct decision, and Player 1 made an incorrect decision. This is true regardless of the outcome.

### Hand 2

```
1: 10 6
2: A 7
D: 8 (up) 8 (hole)
```

Player 1 hits, gets K, and busts.

Player 2 hits and gets 7 to make 15, hits again, gets Q, and busts.

The dealer hits, gets J, and busts.

Who made the better decision here? Again, empirically, Player 1 played correctly. Player 2 should not have initially hit. They both bust, and ultimately it turns out the dealer busted anyway. Womp womp. The house wins.

### In Real Life

There are tons of examples of outcome bias that can be applied to real-world situations. In tech startups specifically, an obvious example is making a bet on a product that ultimately doesn't work out for whatever reason. Maybe people don't like it; a competitor ships something similar or better and people opt to use that; the market shifts away; it turns out that there was some unforeseen obstacle that's not practical to work through, and so on.

There are a ton of things that can go wrong when shipping products to production, and the lesson from this section on outcome bias and Blackjack is that our decisions should be judged based on _the information we had at the time_, and **not** on how they panned out when factors we couldn't control (like the dealer's hole card or the cards that came off the deck) were at play.

## Anchoring

Anchoring is another common cognitive bias, which is basically what happens when your thoughts, ideas, etc. about something are "anchored" to some previous information you have. It's been written about at length, especially in a number of works in behavioral economics, and was famously formalized by [Kahneman and Tversky](https://en.wikipedia.org/wiki/Anchoring_effect).

For this exercise, we split into two groups. Each was presented with a slightly different prompt:

### Group 1

> Without discussing with the group: Do you think there are more or fewer than 5 billion trees on Earth? Write down how many trees you think there are.

### Group 2

> Without discussing with the group: Do you think there are more or fewer than 5 trillion trees on Earth? Write down how many trees you think there are.

Importantly, the only difference between the prompts here is the anchor. One group sees five billion. The other, five trillion. I'm writing this blog post in advance, so I don't know what the guesses are, but the theory is that the group that sees five billion will be anchored to the significantly lower number, and will make significantly lower guesses as a result than the group anchored to five trillion.

### In Real Life

There are two examples that I wanted to mention related to anchoring that were particularly work-specific, both related to pricing:

1. We used to have (and are currently phasing out) a $500/month plan as our first "paid" tier (above pay-as-you-go). This always struck me as pretty steep. Eventually, I realized I felt this way largely because I was anchored to what an old company of mine spent on compute and SaaS vendors, and what we viewed as expensive. Since that bar was set much lower than $500, I was heavily biased downwards on what I thought our pricing should be. That's not to say $500 _isn't_ too high, but it's something to be aware of.
2. Customers are often comparing Hatchet to Temporal, which is significantly more expensive. Often, we discuss pricing as "a quarter of what it costs on Temporal" or similar. This is another obvious case of anchoring. In this case, the anchor is Temporal's pricing, which is affecting how we think about our own pricing (rather than reasoning from first principles, for instance).

## Endogeneity

The last "bias" I discussed was what economists often refer to as "endogeneity," or what some might think of as mistaking correlation for causation. It's not actually a _cognitive_ bias, per se, but you might think of it as a combination of biases like survivorship bias, confirmation bias, experimenter's bias, etc. combining into one pervasive problem across tons of companies, and startups in particular.

This is the section I often like to refer to as "Reforge Bullshit," affectionately named after [Reforge](https://www.reforge.com/), which largely sells poor causal claims as a service.

### 7 Friends in 10 Days

The exercise for this section is more of a conversation. First up: Facebook, which is maybe responsible for the prevalence of Reforge Bullshit in today's world.

> People who add 7 friends in their first 10 days on Facebook end up retaining.

Dead simple, and it gives product teams a focus: if we can drive people to add friends, then they will retain at higher rates than they otherwise would.

This type of thinking took the world by storm, and there have been other famous "aha moment" campaigns in the years since, including Airbnb's "time to first booking," Slack's "the team has collectively sent 2,000 messages," and so on.

### Aha Moments at Hatchet

Once we discussed Facebook, Airbnb, and Slack, I posed the same question to the group who had just been anchored to these other ideas: Could you propose a similar aha moment for Hatchet that we could use to drive more signups and better retention? And I made the group a bet: that I'd be able to make the same refutation to every suggestion (none of which I had heard yet), in addition to the other three.

The refutation is this: Is it possible that, instead of it being the case that people who add seven friends in their first ten days end up retaining, users who are going to retain _for some other, unknown or unknowable (latent) reason_ add seven friends in their first ten days?

At Hatchet, the same applies. Maybe it's not that people who add N team members in the first M days, or people who run a worker in their first H hours end up retaining, but instead that people who are going to retain _anyway_ do these things, because of course they do.

In other words, we have an _endogeneity problem_: it's likely that the causation is backwards, or, in some cases, both things are explained by a third variable.

### In The Real World

From my point of view, there's a basic problem here. We tend to reason backwards from dashboards to make hypotheses, and then either don't run A/B tests to validate them (in the aha moment case) or end up with flat test results because it turned out our hypothesis wasn't causal after all. For instance, we could easily have a dashboard that shows retention broken down by the number of days to run their first worker, see a steep drop-off, and incorrectly conclude that it's likely that running a worker sooner causes retention. This is a wholly incorrect (and unscientific, in the scientific method sense) way of reasoning.

Linear, somewhat famously, does not run A/B tests. Instead, they expect the team to have _taste_ and strong opinions. [They argue](https://x.com/karrisaarinen/status/1706745692965027994) that too often, A/B tests are used as a crutch or to over-optimize for internal incentives vs. what's actually best for the product. Instead, they want their product teams to have strong opinions about what makes for the best experience, and to ship it.

Some people are probably horrified by this. But there are a few reasons why I much prefer this approach:

First, it's fast. No waiting around for tests to complete. Lean into your own product knowledge, ship, collect feedback, iterate.

Second, product analytics and product data in general are riddled with issues, such as ad blockers, identifying users across devices, users having multiple accounts, and so on. On top of that, data warehouses often end up being a mess, and companies tend to not be able to agree on definitions of metrics, which often renders any data-driven decision-making moot.

And finally, and maybe most importantly, it forces product teams to come up with a hypothesis for what will drive the metrics they care about (or the experience they care about) _beforehand_. Too often, teams work backwards: they look at a dashboard, which then informs how they think about what might make a good aha moment. Instead, we should reason _forwards_, thinking from first principles about what aha moment might meaningfully affect the behaviors we care about.

## Some Reflection

The talk went _okay_ I would say. The blackjack examples, which sounded good in my head beforehand, seemed a little bit contrived, and we probably should've done something else. It also would've been better to have more concrete ties back to more specific things we're working on, or have discussed recently.

It also was _long_, which is a note to self for next time.

## Other Fun Biases

I wanted to wrap up my talk by name-dropping a few other fun biases that come up often that I didn't get a chance to discuss.

The **Gambler's Fallacy** is the bias that often manifests at the roulette table: we land on red three spins in a row, and someone says "it _must_ land on black next time," even though spins are independent events.

**Loss aversion** is the bias that makes people feel the "pain" of losing $10 after finding it on the sidewalk more than never having found the $10 in the first place.

And finally, the **Dunning-Kruger Effect** can be thought of as the bias that makes relatively inexperienced people overestimate their ability while more experienced people underestimate it. Or, put differently, it's the effect that might make me look back on this post in five years and cringe at how naïve I was.

Thanks for coming to my talk!