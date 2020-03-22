import { isMultiplePointer, setWebMonetizationPointer, getPoolChanceSum } from './utils'
// import { DEFAULT_CHANCE } from './set-pointer-multiple'
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
      chance: 10
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

describe('interacting with meta web monetization tag', () => {
  const pointer = setWebMonetizationPointer('test')
  test('web monetization api meta tag is in the document', () => {
    expect(pointer).toBeInTheDocument()
  })
  test('does have correct monetization tag', () => {
    expect(pointer).toHaveAttribute('name', 'monetization')
  })
  test('having same pointer as declared', () => {
    expect(pointer).toHaveAttribute('content', 'test')
  })
})

describe('ensure pickPointer() is robust', () => {
  const myPointer = [
    {
      address: 'coolguy',
      chance: 33
    },
    {
      address: 'someother guy',
      chance: 22
    },
    {
      address: 'is doesn\'t matter',
      chance: 45
    }
  ]
  test('get correct sum for pool chance', () => {
    expect(getPoolChanceSum(myPointer)).toBe(100)
  })
})