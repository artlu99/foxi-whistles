---
title: 'User Journey'
pubDate: 2024-10-17T00:00:00Z
description: "Readers and Writers"
author: 'artlu99'
image: '/blog/post-01-cover.png'
tags: ['journeys']
---

### Readin'

After you become a member of a channel, you can decode all casts in that channel going forward, as long as your membership remains valid. You can also decode messages that were written <strong>7 days</strong> prior to your joining the channel, but not earlier. *This may become configurable in the future.* 

- To read a cast in an enabled channel, use the permissionless [Cast Action](https://warpcast.com/~/add-cast-action?url=https%3A%2F%2Fkeccak256-composer-action.artlu.workers.dev%2Fcast-action).
- **alt clients** may decode Whistles natively in the near future
- a **Farcaster mini-app** may enable users to scroll the feed and auto-magically decode Whistles
- **no-code mini-app builders** may support Whistles via plugin

Casts older than <strong>30 days</strong> are removed from Whistles Protocol. *This may change in the future, specifically as we observe how channel dynamics evolve.* Users should always have access to their own Whistles data, and be able to download it for their own records.

### Writin'

- **before Composer Action allowlist approval** use the [Composer Action](https://warpcast.com/~/developers/composer-actions?name=keccak-256&postUrl=https%3A%2F%2Fkeccak256-composer-action.artlu.workers.dev) via the developer playground (desktop only)
- **after Composer Action allowlist approval** draft your cast, and click a button in the bar to Whistle
- in **alt clients** find the toggle or other UX setting

Each channel owner must first opt in to allow the Whistles server to decode messages in their channel. This will be made transparent via the user-facing website. It is already visible in the backend API for devs.

### Farchivin'

- users own their own content. Channel owners own the distribution, not the content.
- *on the roadmap* **Sign In With Farcaster** on this user-facing site in order to download your own Whistles data

> Fun fact: Whistles was conceived by the same person who built Farchiver

---

![How to Whistle.](/blog/post-06.png)

A whistle is a stub of text that has been replaced with another, unintelligible stub of text. Most commonly, the new stub is a Keccak-256 hash, an algorithm that should already be familiar due to its use within the Ethereum EVM.

> No shared content should ever be considered secret. As we all should have learned in middle school, the recipient of a secret may share it without the permission of the creator of the secret. Screenshots are impossible to stop, and this is a feature (not a bug!) of memetic, viral content.

Encoding of a whistle is more like a language than a cipher, and the decoding of a whistle is more like a dictionary than a decryption algorithm.

> If you cast the same Low Effort Reply (e.g., "lol, no") as others, the encoding of that reply will be as easy to decode as recognizing links to YouTube Rickroll videos.

For true private messaging, use a private message frame, or something like XMTP / Comm from ashoat.eth.

