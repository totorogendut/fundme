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

Additionally, it's possible to declare pointer address in the HTML with `<template />`. For this to work `<template />` tag must have `data-fund` and `data-fund-weight` (weight is optional) attribute.

`fund()` must have no parameters when using HTML template monetization.

```html
<template data-fund="$coil.com/my-address" data-fund-weight="10" />
<template data-fund="$coil.com/my-friend-address" data-fund-weight="7" />

<script src="/fundme.js"></script>
<script>
  fund()
</script>
```

## What is this, really (?)

Fundme.js is a whole tree-shakable library to manage monetization on the web. It will include common solutions for cookie-aware ads, cookie prompt, some components to integrate print-on-demand merchandise, and last but not least, the new and shiny Web Monetization API.

Currently it is still rather new and only support Web Monetization API, along with revenue share with [Probabilitic Revenue Sharing](https://coil.com/p/sharafian/Probabilistic-Revenue-Sharing/8aQDSPsw) method.

## Short-term goal

- [ ] Make a JAMstack website to host documentation
- [ ] Early and basic asynchronous ads support (like amp-ads)
- [ ] More robust API!

## Disclaimer

Fundme.js is still in early phase development and thus API might change a lot! Not ready for production.
