import { fund, getCurrentPointerPool, forceFundmeOnBrowser } from '../../../src/fund/main'

import { toBeInTheDocument, toHaveAttribute } from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })

describe('get monetization pointer address from <template></template>', () => {
  test('fund() will scrape from template', () => {
    const pointerAddress = '$money.com/pointer-address2'
    document.body.innerHTML = `
    <template data-fund="${pointerAddress}"></template>
    `
    forceFundmeOnBrowser()
    fund()
    // @ts-ignore
    expect(getCurrentPointerPool()[0].weight).not.toBe(NaN)
    // const metaTag = document.querySelector('meta[name="monetization"]')
    // expect(metaTag).toBeInTheDocument()
    // expect(metaTag).toHaveAttribute('content', pointerAddress)
    document.body.innerHTML = ''
  })

  test('two <template /> tags at the same time', () => {
    const pointerAddress = '$coil.com/pointer-address2'
    document.body.innerHTML = `
      <template data-fund="${pointerAddress}"></template>
      <template data-fund="${pointerAddress}222"></template>
    `
    forceFundmeOnBrowser()
    fund()
    // const metaTag: HTMLMetaElement = document.querySelector('meta[name="monetization"]')
    // expect(metaTag).toBeInTheDocument()
    // expect(metaTag.content).toContain(pointerAddress)
    // @ts-ignore
    expect(getCurrentPointerPool()[0].weight).not.toBe(NaN)
    // @ts-ignore
    expect(getCurrentPointerPool()[1].weight).not.toBe(NaN)
    document.body.innerHTML = ''
  })
  test('two <template></template> tags but one has weight', () => {
    const pointerAddress = '$twitter.com/pointer-address2'
    document.body.innerHTML = `
      <template data-fund="${pointerAddress}"></template>
      <template data-fund="${pointerAddress}222" data-fund-weight="44"></template>
    `
    forceFundmeOnBrowser()
    fund()
    // const metaTag: HTMLMetaElement = document.querySelector('meta[name="monetization"]')
    // expect(metaTag).toBeInTheDocument()
    // expect(metaTag.content).toContain(pointerAddress)
    // @ts-ignore
    expect(getCurrentPointerPool()[0].weight).not.toBe(NaN)
    // @ts-ignore
    expect(getCurrentPointerPool()[1].weight).not.toBe(NaN)
    document.body.innerHTML = ''
  })
  test('two <template></template> tags, both have weight', () => {
    const pointerAddress = '$xrp.com/pointer-address2'
    document.body.innerHTML = `
      <template data-fund="${pointerAddress}" data-fund-weight="0"></template>
      <template data-fund="${pointerAddress}222" data-fund-weight="44"></template>
    `

    forceFundmeOnBrowser()
    fund()
    // const metaTag: HTMLMetaElement = document.querySelector('meta[name="monetization"]')
    // expect(metaTag).toBeInTheDocument()
    // expect(metaTag.content).toBe(pointerAddress + '222')
    // @ts-ignore
    expect(getCurrentPointerPool()[0].weight).not.toBe(NaN)

    document.body.innerHTML = ''
  })
})
