import {
  isMultiplePointer,
  getPoolWeightSum,
  getWinningPointer,
  createWebMonetizationTag,
  setWebMonetizationTag,
  getCurrentPointerAddress
} from './utils'
import { metaTagNotFound } from './errors'

import {
  toBeInTheDocument,
  toHaveAttribute,
} from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })


describe('check multiple pointers correctly', () => {
  test('if pointer is array', () => {
    const arr = []
    const arr2 = ['1', 3]

    expect(isMultiplePointer(arr)).toBeTruthy()
    expect(isMultiplePointer(arr2)).toBeTruthy()
  })
  test('if pointer is object', () => {
    const obj = {
      address: "myaddress",
      weight: 10
    }

    expect(isMultiplePointer(obj)).toBeFalsy()
  })
  test('if pointer is number', () => {
    const randNumber = 14235123

    expect(isMultiplePointer(randNumber)).toBeFalsy()
  })
  test('if pointer is string', () => {
    const randString = 'Wwooooweeeee'

    expect(isMultiplePointer(randString)).toBeFalsy()
  })
})

describe('creating web monetization tag', () => {
  const pointer = createWebMonetizationTag('test')
  const metaTags = document.querySelectorAll('meta[name="monetization"]')
  test('web monetization meta tag is appended on the document', () => {
    expect(metaTags[0]).toBeInTheDocument()
  })

  setWebMonetizationTag(pointer, 'new address')
  test('don\'t append monetization tag if there\'s already one', () => {
    expect(metaTags.length).toBe(1)
  })
  test('and now monetization tag has new address', () => {
    expect(metaTags[0]).toHaveAttribute('content', 'new address')
  })
})

describe('ensure pickPointer() is robust', () => {
  const myPointers = [
    {
      address: 'coolguy',
      weight: 33
    },
    {
      address: 'someother guy',
      weight: 22
    },
    {
      address: 'is doesn\'t matter',
      weight: 45
    }
  ]
  const choice = 50
  test('get correct sum for pool weight', () => {
    expect(getPoolWeightSum(myPointers)).toBe(100)
  })

  test('pick correct winning pointer from pool', () => {
    expect(getWinningPointer(myPointers, choice).address).toBe('someother guy')
  })
})

describe('testing getCurrentPointer()', () => {
  const pointerAddress = '$coil.com/testing'
  document.body.innerHTML = `<meta name="monetization" content=${pointerAddress} />`

  test('get pointer address', () => {
    expect(getCurrentPointerAddress()).toBe(pointerAddress)
  })
  test('throw not found', () => {
    document.querySelector('meta[name="monetization"]').remove()
    expect(() => getCurrentPointerAddress()).toThrowError(metaTagNotFound)
  })
})