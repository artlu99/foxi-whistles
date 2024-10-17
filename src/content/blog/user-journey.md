---
title: 'User Journey'
pubDate: 2024-10-17T12:00:00Z
description: "Readers and Writers"
author: 'artlu99'
image: '/blog/post-01-cover.png'
tags: ['journeys']
---

### Readin'

If you become a member of a channel, you can decode text that was sent <strong>7 days</strong> prior to joining the channel. *This may become configurable in the future.*

- To read the contents of a post that has included a Whistle in an enabled channel, use the permissionless [Cast Action](https://warpcast.com/~/add-cast-action?url=https%3A%2F%2Fkeccak256-composer-action.artlu.workers.dev%2Fcast-action).
- **alt clients** may support Whistles natively in the near future
- a **Farcaster mini-app** may be used to scroll the feed and auto-magically decode Whistles


All casts older than <strong>30 days</strong> are removed from Whistles Protocol. *This may become configurable in the future.*

### Writin'

- **before Composer Action allowlist approval** use the [Composer Action](https://warpcast.com/~/developers/composer-actions?name=keccak-256&postUrl=https%3A%2F%2Fkeccak256-composer-action.artlu.workers.dev) via the developer playground 
- **after Composer Action allowlist approval** start creating your cast
- in **alt clients** toggle or other UX 

Casting at the top level is controlled by Warpcast's channel rules. Reading decoded messages is mapped 1-to-1 with the channel casting privileges.

Each channel owner must opt in to allowing Whistles to decode messages in their channel. This will be made visible via the website. It is already visible in the backend API for devs.

### Farchivin'

- *on the roadmap* **Sign In With Farcaster** on the website to download your Whistles data

> Fun fact: Whistles was conceived by the same person who built Farchiver.

---

![How to Whistle.](/blog/post-06.png)

A whistle is a stub of text that has been replaced with another, unintelligible stub of text. Most commonly, the new stub is a Keccak-256 hash, a concept that  should already be familiar to users from its use within the Ethereum EVM.

> No shared content should ever be considered secret. As we all should have learned in middle school, the recipient of a secret may share it without the permission of the creator of the secret. Screenshots are impossible to stop, and this is a feature (not a bug!) of memetic, viral content.

Encoding of a whistle is more like a language than a cipher, and the decoding of a whistle is more like a dictionary than a decryption algorithm.

> If you cast the same Low Effort Reply (e.g., "wowow", "lol, no") as many others, the encoding of that reply will be as easy to decode as recognizing links to YouTube Rickroll videos.

For true private messaging, use a private message frame or something like XMTP / Comm from ashoat.eth.

