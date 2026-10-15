---
title: "I Was Wrong About A/B Testing"
description: "One lesson after six years of missing the forest for the trees"
date: "2026-10-14"
tags: ["engineering", "career", "growth"]
hidden: false
---

When I started my second job six years ago (at CollegeVine, as a data scientist), my then-manager-now-CTO asked me where I saw my career in five years. I told him I didn't know: It felt so far away.

At the time, I had about six months of work experience, and was feeling a combination of nervousness from imposter syndrome and thinking I had it all figured out. I had a philosophy that revolved around doing things the "right" way: statistical precision, A/B testing for confidence, and so on. Now, I'd sum my engineering philosophy up pretty simply: Be practical, ship quickly. These, in my view, are the two most important things we can do and / or be as engineers to be effective.

Over time, I've become more and more aware that much of what I learned in college and from perusing the internet about working in tech is not always great advice. My experience has largely been that there's one footgun that prevents people in roles like mine from being effective, which is basically the opposite of the two principles I try to follow.

It's **dogmatism**.

I can't count the number of times I've heard arguments in favor of approaching a problem a certain way that basically boil down to "that's just how you're supposed to do it." This often stems from good intentions: building systems that scale, not accumulating technical debt, running A/B tests so we know with some degree of confidence which version of our button performs better, and so on. Many engineers forget that the system they're working on currently serves no traffic at all, and that instead of spending a month building an event-driven-pub-sub-abstract-factory-bean monstrosity, they should just get something into the hands of their customers.

Ultimately, customers don't know if your database is just a JSON file or if you're using the sexiest new features of Postgres. They just want to see widgets on the screen, ideally quickly. The faster you can get something working to your customers, the faster you can get feedback, and, importantly, the faster you can _work on something else_.

Initially at CollegeVine, I was a big proponent of running A/B tests, and, especially, running them the "right" way. I built tooling for how to plan and execute tests (which nobody used), I preached at All Hands about the risks of false-positive test results, and, in hindsight, I wasted a lot of time, both my own and the time of my teammates.

Nowadays, I'm not much of a believer in A/B tests (in most cases). Instead, I take something closer to [Linear's view](https://x.com/karrisaarinen/status/1706745692965027994) of having strong opinions and building something delightful.

In other words, I was missing the forest for the trees, and it's taken me about five years to realize that, or at least be willing to admit it. Instead, I should have been more pragmatic: "Does it _really_ matter if we don't A/B test this feature, and conversion goes down by half a percent as a result, but we save a month of toil in the process?" If the cost of a half-percent drop in conversion is significant (think Amazon), then by all means. But the engineers working on your CRUD app serving 500 customers probably have better ways to spend their time.

These days, if my manager asked me where I'd like to be in five years, I'd have an answer: retired.