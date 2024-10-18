---
title: 'Developer Journey'
pubDate: 2024-10-17T12:00:00Z
description: "Decentralized, composable DX" 
author: 'artlu99'
image: '/blog/post-01-cover.png'
tags: ['journeys']
---

> Whistles Protocol is a composable, decentralized, and permissionless protocol for sharing restricted-distribution information in self-sovereign, transparent, and sufficiently decentralized blah blah.

### tl;dr

- all data served via [GraphQL backend](https://yoga-whistles.artlu.workers.dev/graphql)

- use *graphql-request* [[38-line Next App Router on Vercel example in TS](https://github.com/artlu99/keccak256-composer-action/blob/main/external/schema.ts)] or Apollo Client or whatever you like

### Readin'

Supply a cast hash and viewer FID to the GraphQL endpoint. It returns either the encoded text or the decoded text, based on the location of the cast, and the permissions associated with the viewer FID for that channel's membership.

Casts from <strong>7 days</strong> prior to joining the channel are decodable. *This may become configurable in the future.*

All casts older than <strong>30 days</strong> are removed from Whistles Protocol. *This may become configurable in the future.*

### Writin'

Use the endpoint to write to the [rainbow table](https://en.wikipedia.org/wiki/Rainbow_table), encrypted-at-rest using the shared secrets and made available to all.

Or, supply your own secrets if you don't want other developers (permissionless, decentralized) to be able to read the content shared across the network.

Or, use the shared secrets for maximum distribution, but encapsulate further permissions inside the content, e.g., your own encryption or your own URL redirect links.

### Secrets

> Sharing secrets transparently on decentralized, permissionless rails

- a **nonce** allows the Composer Action, which is an end user-facing webpage with an easily spoofable html form, to tell the Whistles server that its inputs have come from the FID that signed a message within a Farcaster frame-style message.

- a **bearer token** encapulates the encryption secrets as a convenience layer, allowing for key rotation in the event of a breach.

- the set of encryption inputs -- a **secret, salt, and timestamp shift** -- are true secrets, used for symmetric encryption as well as to salt identifying information before passing it through a hash function. Developers may optionally use the shared secrets (which allows for composability), or supply their own secrets when using the protocol.

---

![How to Whistle.](/blog/post-05.png)

> Use the GraphQL server at [Whistles Yoga](https://yoga-whistles.artlu.workers.dev/graphql).

FOSS Composer Action (front-end) [[here](https://github.com/artlu99/keccak256-composer-action)]

FOSS Composer Action (back-end) + Cast Action [[here](https://github.com/artlu99/keccak256-composer-action-worker)]

FOSS Whistles Server [[here]]

FOSS Farcaster alt client [[here](https://github.com/artlu99/bcbhshow-lite-client)]
