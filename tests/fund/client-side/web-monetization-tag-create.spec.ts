import { createWebMonetizationTag, setWebMonetizationTag } from '../../../src/fund/utils'
import { toBeInTheDocument, toHaveAttribute } from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })

describe('creating web monetization tag', () => {
  const pointer = createWebMonetizationTag('test')
  test('web monetization meta tag is appended on the document', () => {
    const metaTags = document.head.querySelectorAll('meta[name="monetization"]')
    expect(metaTags[0]).toBeInTheDocument()
  })

  setWebMonetizationTag(pointer, 'new address')
  test("don't append monetization tag if there's already one", () => {
    const metaTags = document.head.querySelectorAll('meta[name="monetization"]')
    expect(metaTags.length).toBe(1)
  })
  test('and now monetization tag has new address', () => {
    const metaTags = document.head.querySelectorAll('meta[name="monetization"]')
    expect(metaTags[0]).toHaveAttribute('content', 'new address')
  })
})
