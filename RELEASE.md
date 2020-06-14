# Releases

## unreleased

- FEATURE: first glimpse of relative weight is now live!

## 0.1.1

- FEATURE: Server-side fund() now live.
- Hash custom syntax `#` for declaring weight cleaned on single pointer fund().
- Errors now more readable.
- Refactor main.ts

## 0.1.0

- FEATURE: Custom syntax with `<template fundme></template>` tags.

## 0.0.5

- Now you can use string to provide payment pointer address weight with modifier `#`. For example: `$wallet.address.com/test#22` will be read as having `$wallet.address.com/test` as its address and has `22` weight.
- Fix: error parsing JSON `<script fundme>` if the content is `string`.

## 0.0.4

- Add examples for using fundme.js in the browser.
- Now `<script fundme>` will throw an error if its type not `application/json`.
- Test: add test for `<script fundme>` type.

## 0.0.3

- Change production IIFE script name from `fund` to `fundme`. Calling fundme.js in browser now using `fundme.fund()` (previously `fund.fund()` with IIFE).
- Add Server-Side on the roadmap.

## 0.0.2

- Previous NPM publish is accidental and the document isn't clear yet, now README.md has been updated.
- Make it clear that this is a client-side library and tested with ES Module imports
- Link github repo to package.json

## 0.0.1

- Hello world!
