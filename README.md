# Fundme.js

A simple but powerful library to manage monetization on the web.

![Build](https://github.com/ProgNovel/fundme/workflows/Build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ProgNovel/fundme/badge.svg?branch=master)](https://coveralls.io/github/ProgNovel/fundme?branch=master)

## Dig in (WIP - still hasn't published yet)

```js
import { fund } from 'fundme'

fund('$coil.com/some-guy-funding-address')
```

or you can split revenue using [Probabilitic Revenue Sharing](https://coil.com/p/sharafian/Probabilistic-Revenue-Sharing/8aQDSPsw) method.

To split revenue, `fund(pointerAddress)` must take an array containing strings or our own opiniated Web Monetization pointer object. Pointer address objects must have `address` and `weight` in it.

```js
import { fund } from 'fundme'

const validPointerObject = {
  address: '$coil.com/my-address',
  weight: 44
}

fund(['$coil.com/my-friend-pointer-address', '$coil.com/his-friend-pointer-address', validPointerObject])
```

Additionally, it's possible to declare pointer address in the HTML with `<template></template>` tags. For this to work `<template></template>` tag must have `data-fund` and `data-fund-weight` (weight is optional) attribute.

`fund()` must have no parameters when using HTML template monetization.

```html
<template data-fund="$coil.com/my-address" data-fund-weight="10" ></template>
<template data-fund="$coil.com/my-friend-address" data-fund-weight="7" ></template>

<script src="/path/to/fundme.js"></script>
<script>
  fund()
</script>
```

## What is this, really (?)

Fundme.js is a whole tree-shakable library to manage monetization on the web. It will include common solutions for cookie-aware ads, cookie prompt, some components to integrate print-on-demand merchandise, and last but not least, the new and shiny [Web Monetization API](https://www.webmonetization.org).

Currently it is still rather new and only support Web Monetization API, along with revenue share with [Probabilitic Revenue Sharing](https://coil.com/p/sharafian/Probabilistic-Revenue-Sharing/8aQDSPsw) method.

## Short-term goal

- [ ] Simpler and more intuitive implementation that will goes nicely with current API standard.
- [ ] Make a JAMstack website to host documentation.
- [ ] Early and basic asynchronous ads support (like amp-ads).
- [ ] Integrate basic cookies prompt flow and make ads cookie aware if possible (by using non-personalized ads).
- [ ] Web components / Stencil to provide basic `VIP only content` for Web Monetization subscribers.
- [ ] More robust API! Better test!

## Long term goal

I'm planning to make fundme.js a modular library to manage lots of kind monetization that can be imported invidually with ES Module, but still can get along nicely with each other to provide good experience for the users.

For example, webmonetization.org/ads has a tutorial to hide ads for Coil subscribers, but hiding ads doesn't actually save bandwidth and prevent ads trackers from being loaded - especially if webmasters don't spend more effort to implement best practices. There's a need for a middleman to make Web Monetization API and ads play along together. Fundme.js is here as leverage that provide basic flow for all those best practices, and I'm aiming it to be as simple for those with little or no javascript knowledge to implement it; besides copy-paste'd and do a little tweak on the code.

In additionally, integrating broad monetizations like affiliation marketing or print-on-demand is in future roadmap for fundme.js. This library actually is one of core features I'm using on my ProgNovel project, and future plans/features might change as I discover more during my development of ProgNovel.

## Disclaimer

Fundme.js is still in early phase development and thus API might change a lot! Not ready for production. Use scripts from `dist` folder if you want to play with it locally.
