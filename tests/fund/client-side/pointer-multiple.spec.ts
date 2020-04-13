import {
  pickPointer,
  getPointerAddress,
  getChoice,
  setPointerMultiple,
  convertToPointer,
  createPool,
  DEFAULT_WEIGHT,
  checkWeight,
} from '../../../src/fund/set-pointer-multiple'
import { forceFundmeOnBrowser } from '../../../src/fund/main'
import { toBeInTheDocument, toHaveAttribute } from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })

describe('pointers having correct payment address', () => {
  test('correctly convert string to pointer', () => {
    const s: string = 'myaddress'

    expect(convertToPointer(s)).toStrictEqual({
      address: 'myaddress',
      weight: DEFAULT_WEIGHT,
    })
  })

  test('correcting get address (string) from pointer', () => {
    const pointer = {
      address: 'my address is cool',
      weight: 55,
    }

    expect(getPointerAddress(pointer)).toBe('my address is cool')
  })

  test('pointer.address must not undefined', () => {
    const pointer = {
      weight: 11,
    }
    // @ts-ignore
    expect(() => getPointerAddress(pointer)).toThrowError(/not found/)
  })
  test('pointer.address must not undefined', () => {
    const pointer = {
      address: 222,
      weight: 11,
    }
    // @ts-ignore
    expect(() => getPointerAddress(pointer)).toThrowError(/must be a string/)
  })

  test('throw pointer without an address', () => {
    const pointers = [
      'myaddress',
      // @ts-ignore
      {
        weight: 5,
      },
      {
        address: 'myaddress2',
        weight: 11,
      },
    ]
    forceFundmeOnBrowser()
    // @ts-ignore
    expect(() => setPointerMultiple(pointers)).toThrow()
  })
})

describe('creating weight pool', () => {
  const rawPointers = [
    'my address',
    {
      address: 'address with weight',
      weight: 10,
    },
    'my other address',
  ]
  const pool = createPool(rawPointers)
  test('convert all string to legal pointers', () => {
    let noString = pool.every((pointer) => {
      return 'address' in pointer && 'weight' in pointer
    })

    expect(noString).toBeTruthy()
  })
})

describe('pointers from weight pool', () => {
  test('can pick if has weight', () => {
    const pointers1 = [
      {
        address: 'with weight',
        weight: 11,
      },
      {
        address: 'another weight',
        weight: 5,
      },
      {
        address: 'doge',
        weight: 0,
      },
      {
        address: 'pussycat',
        weight: 0,
      },
    ]
    expect(pickPointer(pointers1).address).toContain('weight')
  })
  test('avoid if has no weight', () => {
    const pointers2 = [
      {
        address: 'has weight',
        weight: 5,
      },
      {
        address: 'noweight',
        weight: 0,
      },
    ]

    expect(pickPointer(pointers2).address).not.toBe('noweight')
  })

  test('correct empty weight on WMPointer', () => {
    const pointer = {
      address: 'my.address/',
    }

    // @ts-ignore
    expect(checkWeight(pointer)).toStrictEqual({ address: 'my.address/', weight: DEFAULT_WEIGHT })
  })

  test('get choice from random weight sum', () => {
    const choice = getChoice(55)

    expect(choice).toBeGreaterThan(0)
    expect(choice).toBeLessThanOrEqual(55)
  })
})
