---
title: "Cognitive Biases"
description: "My 2026 'Unconference' Talk"
date: "2026-09=10"
tags: ["misc"]
hidden: true
---

At Hatchet, we've been developing something of a tradition during offsites that we've been calling an "Unconference." The idea is that each member of the team gives a short (think 20-30 minutes) talk on something of their choosing, which helps us get to know each other better and maybe learn something new in the process.

Past unconference talks have included a deep dive into a teammate's life story, a workshop on how to improve your writing, and the history of a prior startup. My last talk was on basic concepts in game theory: [The Prisoner's Dilemma](https://en.wikipedia.org/wiki/Prisoner%27s_dilemma), the [Stag Hunt](https://en.wikipedia.org/wiki/Stag_hunt), [Knife-Edge Equilibria](https://jrm-research.blogspot.com/2007/05/knife-edge-equilibrium.html), and how some of these basic games can apply to real world situations.

This year, I'm giving my talk on philosophical razors and cognitive biases. I like giving "talks" that are mostly made up of exercises. Last year, we played the games to help everyone work through the decision-making for themselves, since game theory is ultimately about making decisions. This year, we did the same.

## Outcome Bias

I started by asking everyone to close their eyes, and then asking a question: Raise your hand if you believe that the outcome of a decision affects how good the decision was.

Then, we played two hands of Blackjack.

### Hand 1

```
1: 10 4
2: A 9
D: 6 (up) Q (hole)
```

Player 1 hits, and gets 7. Blackjack.

Player 2 stands.

The dealer has to hit, and gets 4, for 20. Player 1 wins, player 2 loses.

Who made the better decision?

This is a trivial example, but the point here is that if you mean "empirically correct" by "better," then Player 2 made the correct decision, and Player 1 made an incorrect decision. This is true regardless of the outcome.

### Hand 2

```
1: 10 6
2: A 7
D: 8 (up), 8 (hole)
```

Player 1 hits and gets K, and busts.

Player 2 hits and gets 7 to make 15, hits again, gets Q, and busts.

The dealer hits, gets J, and busts.

Who made the better decision here? Again, empirically, Player 1 played correctly. Player 2 should not have initially hit. They both bust, and ultimately it turns out the dealer busted anyways. Womp womp. The house wins.

### In Real Life

There are tons of examples of outcome bias that can be applied to real-world situations. In tech start ups specifically, an obvious example is making a bet on a product that ultimately doesn't work out for whatever reason. Maybe people don't like it, a competitor ships something similar or better and people opt to use that, the market shifts away, it turns out that there was some unforeseen obstacle that's not practical to work through, and so on.

There are a ton of things that can go wrong when shipping products to production, and the lesson from this section on outcome bias and Blackjack is that our decisions should be judged based on _the information we had at the time_, and **not** based on how they panned out if there were factors we could not control, like the dealer's down card or the cards that came off the deck, at play.

## Anchoring

Anchoring is another common cognitive bias, which basically is what happens when your thoughts, ideas, etc. about something are "anchored" to some previous information you have. It's been written about at length, especially in a number of works in behavioral economics, and was famously originally formalized by [Kahneman and Tversky](https://en.wikipedia.org/wiki/Anchoring_effect).

For this exercise, we split into two groups. Both were presented with two sentences:

### Group 1

> Without discussing with the group: Do you think there are more or fewer than 5 billion trees on Earth? Write down how many trees you think there are.

### Group 2

> Without discussing with the group: Do you think there are more or fewer than 5 trillion trees on Earth? Write down how many trees you think there are.

Importantly, the only difference between the prompts here is the anchor. One group sees five billion. The other, five trillion. I'm writing this blog post in advance, so I don't know what the guesses are, but the theory is that the group that sees five billion will be anchored to the significantly lower number, and will make guesses that are significantly lower as a result, than the group anchored to five trillion.

### In Real Life

There are two examples that I wanted to mention related to anchoring that were particularly work specific, both related to pricing:

1. We used to (currently phasing out) have a $500 / month plan as our first "paid" tier (above pay-as-you-go). This always struck me as pretty steep. Eventually, I realized I felt this way largely because I was anchored to what an old company of mine spent on compute and SaaS vendors, and what we viewed as expensive. Since that bar was set much lower than $500, I was heavily biased downwards on what I thought our pricing should be. Note that that's not to say that $500 is _not_ too high, but just something to be aware of.
2. Customers are often comparing Hatchet to Temporal, which is significantly more expensive. Often, we discuss pricing as "1/4th of what it costs on Temporal" or similar. This is another obvious case of anchoring. In this case, the anchor is Temporal's pricing, which is affecting how we think about our own pricing (rather than reasoning from first principles, for instance).


