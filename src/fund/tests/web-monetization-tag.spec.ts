import {
  setWebMonetizationPointer
} from '../utils'

import {
  toBeInTheDocument,
  toHaveAttribute,
} from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })

describe('interacting with meta web monetization tag', () => {
  const pointer = setWebMonetizationPointer('test')
  const metaTags = document.querySelectorAll('meta[name="monetization"]')
  test('web monetization api meta tag is in the document', () => {
    expect(metaTags[0]).toBeInTheDocument()
  })
  test('does have correct monetization tag', () => {
    expect(pointer).toHaveAttribute('name', 'monetization')
  })
  test('having same pointer as declared', () => {
    expect(pointer).toHaveAttribute('content', 'test')
  })
})