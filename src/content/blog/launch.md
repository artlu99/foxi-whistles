---
title: 'Whistles released in the wild'
pubDate: 2024-10-07T12:00:00Z
description: "We're excited to introduce you to the Decentralized Whistles Protocol a..."
author: 'artlu99'
image: '/blog/post-01-cover.png'
tags: ['announcement']
---

![Whistles is here.](/blog/post-01.png)

A whistle is a stub of text that has been replaced with another, unintelligible stub of text. Most commonly, the new stub is a Keccak-256 hash, a concept that  should already be familiar to users from its use within the Ethereum EVM.

The content inside a whistle is meant to be consumed by a subset of users who have been granted permission by the creator of the content, based on their choice of where to distribute the content (i.e., which channel).

Encoding of a whistle is more like a language than a cipher, and the decoding of a whistle is more like a dictionary than a decryption algorithm.

No shared content should ever be considered secret. As we all should have learned in middle school, the recipient of a secret may share it without the permission of the creator of the secret. Screenshots are impossible to stop, and this is a feature (not a bug!) of memetic, viral content.

If you cast the same Low Effort Reply (e.g., "wowow", "lol, no") as many others, the encoding of that reply will be as easy to decode as recognizing links to YouTube Rickroll videos.

For true private messaging, use a [private message frame](https://github.com/artlu99/private-frame-artlu-xyz) or something like XMTP / Comm from ashoat.eth.

The <strong>Decentralized Whistles Protocol</strong> leverages cryptographic building blocks and the open Farcaster Protocol, to share restricted-distribution information in self-sovereign, transparent, and sufficiently decentralized blah blah. Sufficiently permissionless and decentralized data availability for fun and profit!

> Fun fact: Whistles was inspired by sha25leo.eth's Dolphin Translate frame and many community casts in /dolphin-zone .

To read the contents of a post that has included a Whistle, use the permissionless [Cast Action](https://warpcast.com/~/add-cast-action?url=https%3A%2F%2Fkeccak256-composer-action.artlu.workers.dev%2Fcast-action). Also, with composability, a mini-app may be used to scroll the feed and automagically decode Whistles. Or, alt clients such as Recaster and BCBHShow Lite Client may also support Whistles natively in the near future.

### Key Features

- **Composable**: an open GraphQL [backend](https://whistles.artlu.xyz/graphql) to enable permissionless innovation.
- **Transparent**: the encrypted-at-rest data is available for everyone to copy, redistribute, enhance.
- **Portable**: an independent cryptography primitive on top of Farcaster social tech.

### Future Roadmap

- **FC Channels-based Permissioning** decoding can be gated based on channel permissions established at the Farcaster protocol level.
- **Integrations** Warpcast will get a mini-app for scrolling permissioned content natively. Alternate clients will present the decoded feed natively as well.
- **Self-Sovereign Data**: End Users will always be able to access and download their own data.
- **Cryptography** data is currently stored encrypted-at-rest using CGM-AES. This may be enhanced with forward ratchet cryptography, which enables interesting time-dependent features of the data gating

> Fun fact: Whistles was independently born around the same time as briceyan's Honk64 Encoding. Compare the dates in our public GH repos.
