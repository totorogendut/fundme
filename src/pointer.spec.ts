import { pickPointer, getPointerAddress, getChoice, setPointerMultiple, convertToPointer, stabilizeChance, createPool, DEFAULT_CHANCE } from './set-pointer-multiple'
import { setWebMonetizationPointer } from './utils'
import {
  toBeInTheDocument,
  toHaveAttribute,
} from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })

describe('pointers having correct payment address', () => {
  test('correctly convert string to pointer', () => {
    const s: string = 'myaddress'

    expect(convertToPointer(s)).toStrictEqual({
      address: 'myaddress',
      chance: DEFAULT_CHANCE
    })
  })

  test('correcting get address (string) from pointer', () => {
    const pointer = {
      address: 'my address is cool',
      chance: 55
    }

    expect(getPointerAddress(pointer)).toBe('my address is cool')
  })

  test('pointer.address must not undefined', () => {
    const pointer = {
      chance: 11
    }
    // @ts-ignore
    expect(() => getPointerAddress(pointer)).toThrowError(/not found/)
  })
  test('pointer.address must not undefined', () => {
    const pointer = {
      address: 222,
      chance: 11
    }
    // @ts-ignore
    expect(() => getPointerAddress(pointer)).toThrowError(/must be a string/)
  })

  test('throw pointer without an address', () => {
    const pointers = [
      'myaddress',
      // @ts-ignore
      {
        chance: 5
      },
      {
        address: 'myaddress2',
        chance: 11
      }
    ]
    // @ts-ignore
    expect(() => setPointerMultiple(pointers)).toThrow()
  })
})

describe('creating chance pool', () => {
  const rawPointers = [
    'my address',
    {
      address: 'address with chance',
      chance: 10
    },
    'my other address'
  ]
  const pool = createPool(rawPointers)
  test('convert all string to legal pointers', () => {
    let noString = pool.every(pointer => {
      return ('address' in pointer) && ('chance' in pointer)
    });

    expect(noString).toBeTruthy()
  })
})

describe('pointers from chance pool', () => {
  test('can pick if has chance', () => {
    const pointers1 = [
      {
        address: 'with chance',
        chance: 11
      },
      {
        address: 'another chance',
        chance: 5
      },
      {
        address: 'doge',
        chance: 0,
      },
      {
        address: 'pussycat',
        chance: 0
      },
    ]
    expect(pickPointer(pointers1).address).toContain('chance')
  })
  test('avoid if has no chance', () => {
    const pointers2 = [
      {
        address: 'has chance',
        chance: 5,
      },
      {
        address: 'nochance',
        chance: 0
      },
    ]

    expect(pickPointer(pointers2).address).not.toBe('nochance')
  })

  test('correct empty chance on WMPointer', () => {
    const pointer = {
      address: 'my.address/'
    }

    // @ts-ignore
    expect(stabilizeChance(pointer)).toStrictEqual({ address: 'my.address/', chance: DEFAULT_CHANCE })
  })

  test('get choice from random chance sum', () => {
    const choice = getChoice(55)

    expect(choice).toBeGreaterThan(0)
    expect(choice).toBeLessThanOrEqual(55)
  })
})

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