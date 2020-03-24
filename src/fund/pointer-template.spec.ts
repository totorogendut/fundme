import { fund } from './main'
import { getCurrentPointerPool } from './utils'
import {
  toBeInTheDocument,
  toHaveAttribute,
} from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })


describe('get monetization pointer address from <template />', () => {
  const pointerAddress = '$coil.com/pointer-address1'
  document.body.innerHTML = `
    <template data-fund="${pointerAddress}" />
  `
  fund()
  const metaTag = document.querySelector('meta[name="monetization"]')

  test('fund() will scrape from template', () => {
    expect(metaTag).toBeInTheDocument()
  })

  test('fund() will scrape from template', () => {
    expect(metaTag).toHaveAttribute('content', pointerAddress)
  })
})

describe('get weight from <template data-fund-weight="xx" />', () => {
  const pointerAddress = '$coil.com/pointer-address1'
  document.body.innerHTML = `
    <template data-fund="${pointerAddress}" data-fund-weight="52" />
  `
  fund()
  const metaTag = document.querySelector('meta[name="monetization"]')

  test('fund() will scrape from template', () => {
    expect(getCurrentPointerPool()[0].weight).toBe(52)
  })
})