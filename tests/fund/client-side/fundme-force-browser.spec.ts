import { fund } from '../../../src/fund/main'

import { toBeInTheDocument, toHaveAttribute } from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })

describe('force fund() on browser', () => {
  test('force single pointer fund() on browser', () => {
    const pointer = '$wallet.example.com/test1'

    fund(pointer, {
      force: 'client',
    })

    const meta = document.querySelector('meta[name="monetization"]')

    expect(meta).toBeInTheDocument()
    expect(meta).toHaveAttribute('content', pointer)
  })
})
