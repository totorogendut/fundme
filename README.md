# Fundme.js

A simple but powerful client-side library to manage monetization on the web.

![Build](https://github.com/ProgNovel/fundme/workflows/Build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ProgNovel/fundme/badge.svg?branch=master)](https://coveralls.io/github/ProgNovel/fundme?branch=master) ![GitHub top language](https://img.shields.io/github/languages/top/prognovel/fundme) ![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/fundme) ![npm](https://img.shields.io/npm/v/fundme) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/fundme)

## Dig in

```shell
npm i fundme --save
```

_This library is still work in progress, not ready for production! Tested and worked using Webpack with ES Module import._

### Get Started with Web Monetization API

Web Monetization API is a new web standard being developed to provide better payment alternative for publishers and creators other than ads. Learn more about it on [https://www.webmonetization.org](https://www.webmonetization.org).

#### Using Fundme.js in Client-Side with bundler; webpack, rollup, parcel, etc

Example with ES Modules

```js
import { fund } from 'fundme'

fund('$wallet.example.com/some-guy-funding-address')
```

#### Using Fundme.js in the browser

Fundme.js is designed to be fully tree-shakeable library thus it has quite a weird way to use in the browser than normal library. It needs to use IIFE (Immediately Invoked Function Expression) to get exported function that normally use in brackets when importing it with ES Module.

```html
<script src="/dist/fundme-iife.min.js"></script>
<script>
  fundme.fund('$wallet.example.com/my-address')
</script>
```

### Using Fundme.js Server-Side in Node

Using Fundme.js with CommonJS - note that usage in Node is still Work In Progress, using this will give you an error.

```js
const { fund } = require('fundme')

fund('$wallet.example.com/some-guy-funding-address')

/*
  Instead of manipulating monetization meta tag in the DOM, Server-Side
  Fundme.js will return DOM string that you can inject to your page.

  This is useful if you want to calculate Fundme.js built-in
  revenue share system on your server.
*/
```

**WIP** - Server-Side Fundme.js is in the roadmap for short-term goal.

### Advanced Monetization - Revenue Share Among Contributors

Web Monetization API can only stream one pointer address due to performance issue, but you can split revenue using [Probabilitic Revenue Sharing](https://coil.com/p/sharafian/Probabilistic-Revenue-Sharing/8aQDSPsw) method that relies on chance whoever gets picked among contributors.

To split revenue, `fund(pointerAddress)` must take an array containing strings or our own opiniated Web Monetization pointer object. Pointer address objects must have `address` and `weight` in it.

Below is a scenario where author of a content get the most of the revenue of an article, while editor and proofreader get the same slice of the pie, while the website owner get the least (website owner's chance isn't being implictly set, but more that on the code).

#### With pure JavaScript

```js
import { fund } from 'fundme'

const AuthorPointerAddress = {
  address: '$wallet.example.com/author-address',
  weight: 40,
}

const EditorPointerAddress = {
  address: '$wallet.example.com/editor-address',
  weight: 10,
}

const ProofreaderPointerAddress = {
  address: '$wallet.example.com/proofreader-address',
  weight: 10,
}

// pointers with type string or those with no weight will use
// default weight which is 5
const WebsiteOwnerPointerAddress = '$wallet.example.com/website-owner'

// calling the function...
fund([AuthorPointerAddress, EditorPointerAddress, ProofreaderPointerAddress, WebsiteOwnerPointerAddress])
```

Additionally, in case you don't like working with objects, it's possible to work solely with an array of strings but still declaring their chances. Fundme.js will read modifier `#` at the end of the pointer address as a way to read a payment pointer's weight.

```js
import { fund } from 'fundme'

fund([
  '$wallet.example.com/this-has-weight-ten#10',
  '$wallet.example.com/this-has-weight-six#6',
  '$wallet.example.com/this-has-weight-seven#7',
])
```

#### Inside HTML pages

It's possible to declare pointer address with `<template></template>` tags. Instead of pointing payment address in function parameters you can set it beforehand in the HTML and let fundme.js scrape them during the browser runtime. For this to work, `<template></template>` tag must have `data-fund` and `data-fund-weight` (weight is optional) attribute.

`fund()` must have no parameters when using HTML template monetization. Note that below are for examples purpose (you can use the template tags in HTML but please use ES Module import to use `fund()` for now).

```html
<!-- WARNING: you must close <template> tags with proper closing tag -->
<template data-fund="$wallet.example.com/my-address" data-fund-weight="10"></template>
<template data-fund="$wallet.example.com/my-friend-address" data-fund-weight="7"></template>

<script src="/dist/fundme-iife.min.js"></script>
<script>
  fundme.fund('$wallet.example.com/my-address')
</script>
```

If you prefer to work directly from JSON, like listing revenue sharing contributors from server-side or static sites, you can also write an array in `<script fundme type="application/json">` tags. (Note the `fundme` attribute!)

```html
<script fundme type="application/json">
  [
    "$xrp.com/some-address-with-no-weight",
    {
      "address": "$wallet.example.com/address-with-weight",
      "weight": 12
    },
    {
      "address": "$wallet.example.com/another-one-with-weight",
      "weight": 3
    }
  ]
</script>

<!-- PROTIP: instead of IIFE script, you can use browser native ES Modules -->
<!-- be aware that browser ES Modules still isn't widely support by browsers -->
<script type="module">
  import { fund } from '/dist/fundme.mjs'

  fund()
</script>
```

However, we have an opiniated (and recommended) way to declare payment pointers with familiar custom syntax. We're using `<template fundme></template>` tags but without declare payment pointers and revenue share weights inside `data-fund` and such, declaring them directly inside the tags instead.

NOTE: all payment pointer has to be separated by semicolons (like CSS or JavaScript lines).

```html
<template fundme>
  $wallet.example.com/this-has-weight-ten#10; $wallet.example.com/this-has-weight-twelve#12;
  $wallet.example.com/this-has-weight-twelve#12;
</template>

<!-- PROTIP: instead of IIFE script, you can use browser native ES Modules -->
<!-- be aware that browser ES Modules still isn't widely support by browsers -->
<script type="module">
  import { fund } from '/dist/fundme.mjs'

  fund()
</script>
```

## What is this, really (?)

Fundme.js is a whole tree-shakable library to manage monetization on the web. It will include common solutions for cookie-aware ads, cookie prompt, some components to integrate print-on-demand merchandise, and last but not least, the new and shiny [Web Monetization API](https://www.webmonetization.org).

Currently it is still rather new and only support Web Monetization API, along with revenue share with [Probabilitic Revenue Sharing](https://coil.com/p/sharafian/Probabilistic-Revenue-Sharing/8aQDSPsw) method.

## Short-term goal

- [ ] Add bias system.
- [ ] Make some config to let Fundme.js operate in Server-Side.
- [ ] A way to get relative chances for contributors' addresses (something like CSS relative unit).
- [ ] RegEx safety net to warn website owners if one or more Web Monetization API pointer addresses are invalid
- [ ] Simpler and more intuitive implementation that will goes nicely with current API standard.
- [ ] Make a JAMstack website to host documentation.
- [ ] Early and basic asynchronous ads support (like amp-ads).
- [ ] Integrate basic cookies prompt flow and make ads cookie aware if possible (by using non-personalized ads).
- [ ] Web components / Stencil to provide basic `VIP only content` for Web Monetization subscribers.
- [ ] More robust API! Better tests!

## Long term goal

I'm planning to make fundme.js a modular library to manage lots of kind monetization that can be imported invidually with ES Module, but still can get along nicely with each other to provide good experience for the users.

For example, webmonetization.org/ads has a tutorial to hide ads for Coil subscribers, but hiding ads doesn't actually save bandwidth and prevent ads trackers from being loaded - especially if webmasters don't spend more effort to implement best practices. There's a need for a middleman to make Web Monetization API and ads play along together. Fundme.js is here as leverage that provide basic flow for all those best practices, and I'm aiming it to be as simple for those with little or no javascript knowledge to implement it; besides copy-paste'd and do a little tweak on the code.

In additionally, integrating broad monetizations like affiliation marketing or print-on-demand is in future roadmap for fundme.js. This library actually is one of core features I'm using on my ProgNovel project, and future plans/features might change as I discover more during my development of ProgNovel.

## Disclaimer

Fundme.js is still in early phase development and thus API might change a lot! Not ready for production. Use scripts from `dist` folder in the repo if you want to play with it locally.
