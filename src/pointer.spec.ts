import { setPointerMultiple, convertToPointer, stabilizeChance, DEFAULT_CHANCE } from './set-pointer-multiple'
import { pickPointer } from './set-pointer-multiple'

describe('pointers having correct payment address', () => {
  test('correctly convert string to pointer', () => {
    const s: string = 'myaddress'

    expect(convertToPointer(s)).toStrictEqual({
      address: 'myaddress',
      chance: DEFAULT_CHANCE
    })
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
})
