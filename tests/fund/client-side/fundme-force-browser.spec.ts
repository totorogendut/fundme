import { fund } from '../../../src/fund/main'
import { isBrowser } from '../../../src/fund/fund-browser'

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

  test('force multiple pointer fund() on browser', () => {
    const pointers = ['$wallet.example.com/test1', '$wallet.example.com/test2']

    fund(pointers, {
      force: 'client',
    })

    const meta: HTMLMetaElement = document.querySelector('meta[name="monetization"]')

    expect(meta).toBeInTheDocument()
    expect(meta.content).toContain('$wallet.example.com/test')
  })
})

describe('test isBrowser()', () => {
  test('force client is enabled', () => {
    expect(isBrowser({ force: 'client' })).toBeTruthy()
  })
  test('force server is enabled', () => {
    expect(isBrowser({ force: 'server' })).toBeFalsy()
  })
  test('without forcing in node environment', () => {
    expect(isBrowser()).toBeFalsy()
  })
})
