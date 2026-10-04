---
title: "The Joys of Self-Hosting"
description: "Reflections on ~1.5 years with my first Raspberry Pi"
date: "2026-10-04"
tags: ["engineering"]
hidden: true
---

I bought my first Raspberry Pi in May 2025. At the time, I think I was just on the hunt for a new hobby project after realizing that flashing Ubuntu Server onto my old MacBook Pro probably wasn't a good way to run a home server. So I figured I'd go for it, and spent the $150 or so on the Pi 5.

It's been a joy.

The initial reason for buying the Pi was to run [Pi-hole](https://pi-hole.net/) (which I'd highly recommend!). Since then, I've set up a [bunch](https://medici.sn-p.sh) [of](https://cylo.mkaye.dev/) [little](https://recipebox.mkaye.dev/) [apps](https://artemis.sn-p.sh/) that I've written over time without needing to pay recurring PaaS fees. They mostly just run in containers orchestrated by Docker Compose and talk to a database running on the Pi.

I'm also running a handful of open-source services that I've been using virtually every day:

- [Grafana](https://grafana.com/) has some dashboards for things I like to keep track of (workouts, system metrics, etc.).
- [Miniflux](https://miniflux.app/) is my RSS reader, which pulls a bunch of RSS feeds that I read on my phone with [Lire](https://lireapp.com/).
- [Navidrome](https://www.navidrome.org/) is my music server, and I stream to my phone using [Amperfy](https://github.com/BLeeEZ/amperfy).
- [Obsidian LiveSync](https://github.com/vrtmrz/obsidian-livesync) keeps my Obsidian notes in sync across my devices.
- This site.

Over time, I've really valued owning the hardware that all of my stuff is running on, and not needing to think about anything if I want to deploy a new service, run a cron job, etc. And the setup and maintenance have been surprisingly easy. I have a 1TB Samsung T7 that I back up the Pi's own NVMe drive to each night, and otherwise there hasn't been too much else to do. I'm running [Tailscale](https://tailscale.com/), and the services I have running are largely served either behind Caddy over Tailscale or through [Cloudflare Tunnels](https://developers.cloudflare.com/tunnel/).

I've also been able to cord cut a bit. I've been loving not paying Spotify and instead going back to owning my own music collection. I've been buying CDs, which I probably hadn't done in at least fifteen years, and had fun digging through boxes of music in a couple of local record stores and thrift shops in Cambridge and Bozeman lately looking for music to add to my collection.

It's been a similar story for not needing to pay for Obsidian's sync offering to sync notes between devices too. Obsidian's a pretty important piece of tech for me which I use for all sorts of stuff, and the "wow, it works!" moment when LiveSync first successfully synced a note from my laptop to my phone reminded me of the old joy of programming.

I've also found that I have a long list of other possible ideas for things I can self-host. I've been thinking a lot about [VaultWarden](https://github.com/dani-garcia/vaultwarden) and [Immich](https://immich.app/) lately to help get me off of 1Password and Google Photos, but haven't taken the plunge yet because I'm still nervous about backups. Maybe soon!


