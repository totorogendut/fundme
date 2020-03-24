import { fund } from '../main'

import {
  toBeInTheDocument,
  toHaveAttribute,
} from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })


describe('get monetization pointer address from <template />', () => {
  const pointerAddress = '$coil.com/pointer-address2'
  document.body.innerHTML = `
    <template data-fund="${pointerAddress}" />
  `
  fund()
  const metaTag = document.querySelector('meta[name="monetization"]')

  test('fund() will scrape from template', () => {
    expect(metaTag).toBeInTheDocument()
  })

  test('fund() will has pointer address', () => {
    expect(metaTag).toHaveAttribute('content', pointerAddress)
  })
  document.body.innerHTML = ''
})