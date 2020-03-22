import { isMultiplePointer, stabilizeChance } from './utils'
import { DEFAULT_CHANCE } from './set-pointer-multiple'

// TODO breakdown these test with describe() and test each separately
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

test('correct empty chance on WMPointer', () => {
  const pointer = {
    address: 'my.address/'
  }

  // @ts-ignore
  expect(stabilizeChance(pointer)).toStrictEqual({ address: 'my.address/', chance: DEFAULT_CHANCE })
})