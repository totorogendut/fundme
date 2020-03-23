# Fundme.js

A simple but powerful library to manage monetization on the web.

![Build](https://github.com/ProgNovel/fundme/workflows/Build/badge.svg)[![Coverage Status](https://coveralls.io/repos/github/ProgNovel/fundme/badge.svg?branch=master)](https://coveralls.io/github/ProgNovel/fundme?branch=master)

## Dig in (WIP)
```js
import fund from 'fundme'

fund('wm-pointer-address')
```

or you can split revenue using [Probabilitic Revenue Sharing](https://coil.com/p/sharafian/Probabilistic-Revenue-Sharing/8aQDSPsw) method.

`fund()` must take an array containing strings or our own opiniated Web Monetization pointer object. Pointer objects must have `address` and `chance` in it.

```js
import fund from 'fundme'

const validPointerObject = {
  address: 'some other guy address',
  chance: 44
}

fund(['my first address', 'my friend pointer address', validPointerObject])
```

## What is this, really?

Fundme.js is a whole tree-shakable library to manage monetization on the web. It will include common solutions for cookie-aware ads, cookie prompt, some components to integrate print-on-demand merchandise, and last but not least, the new and shiny Web Monetization API.

Currently it is still rather new and only support Web Monetization API, along with revenue share with [Probabilitic Revenue Sharing](https://coil.com/p/sharafian/Probabilistic-Revenue-Sharing/8aQDSPsw) method.

## Short-term goal

- [ ] Make a JAMstack website to host documentation
- [ ] Early and basic asynchronous ads support (like amp-ads)
- [ ] More robust API!
