import { fund } from './main'
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

  test('fund() will scrape from template', () => {
    fund()

    const metaTag = document.querySelector('meta[name="monetization"]')
    expect(metaTag).toBeInTheDocument()
    expect(metaTag).toHaveAttribute('content', pointerAddress)
  })
})