---
title: "The Joys of Self-Hosting"
description: "Reflections on ~1.5 years with my first Raspberry Pi"
date: "2026-10-04"
tags: ["engineering"]
hidden: true
---

I bought my first Raspberry Pi last May. At the time, I think I was just on the hunt for a new hobby project after realizing that flashing Ubuntu Server onto my old MacBook Pro probably wasn't a good way to run a home server. So I figured I'd go for it, and spent the $150 or so on the Pi 5.

It's been a joy.

The initial reason for buying the Pi was to run [Pi-hole](https://pi-hole.net/) (which I'd highly recommend!). Since then, I've set up a [bunch](https://medici.sn-p.sh/login) [of](https://cylo.mkaye.dev/) [little](https://recipebox.mkaye.dev/) [apps](https://artemis.sn-p.sh/) that I've written over time without needing to pay recurring PaaS fees. They mostly just run in containers orchestrated by Docker Compose and talk to a database running on the Pi.

I also am running a handful of open-source services that I've been using virtually every day:

- [Grafana](https://grafana.com/) has some dashboards for things I like to keep track of (workouts, system metrics, etc.).
- [Miniflux](https://miniflux.app/) is my RSS reader, which pulls a bunch of RSS feeds and then I read on my phone with [Lire](https://lireapp.com/).
- [Navidrome](https://www.navidrome.org/) is my music server, and I stream to my phone using [Amperfy](https://github.com/BLeeEZ/amperfy)
- This site.
- [Obsidian LiveSync](https://github.com/vrtmrz/obsidian-livesync) keeps my Obsidian notes in sync across my devices.

Over time, I've really valued owning the hardware that all of my stuff is running on, and not needing to think about anything if I want to deploy a new service, run a cron job, etc.

I've also been able to cable cut a bit. I've been loving not paying Spotify and instead going back to owning my own music collection (I've been buying CDs, which I probably hadn't done in at least fifteen years). And similar for not needing to pay for Obsidian's sync offering to sync notes between devices.

