import {
  fund,
  setDefaultAddress,
  getCurrentPointerAddress,
  getCurrentPointerPool,
  forceFundmeOnBrowser,
} from '../../../src/fund/main'
import { defaultAddressNotFound } from '../../../src/fund/errors'
import { DEFAULT_WEIGHT } from '../../../src/fund/set-pointer-multiple'

describe('default pointer', () => {
  test('correctly set default pointer for single paramter', () => {
    setDefaultAddress('default 1')
    forceFundmeOnBrowser()
    fund('default')
    expect(getCurrentPointerAddress()).toBe('default 1')
  })

  test('set default address with multiple pointers', () => {
    const pointers = [
      '$twitter.com/my-address',
      // @ts-ignore
      {
        address: '$coil.com/test',
        weight: 6,
      },
      {
        address: '$xrp.com/my-address2',
        weight: 11,
      },
    ]
    setDefaultAddress(pointers)
    const expectedPointers = [
      {
        address: '$twitter.com/my-address',
        weight: DEFAULT_WEIGHT,
      },
      {
        address: '$coil.com/test',
        weight: 6,
      },
      {
        address: '$xrp.com/my-address2',
        weight: 11,
      },
    ]

    forceFundmeOnBrowser()
    fund('default')
    expect(getCurrentPointerPool()).toEqual(expectedPointers)
  })
  test("throw if using default but default address hasn't been set", () => {
    setDefaultAddress(undefined)
    forceFundmeOnBrowser()
    expect(() => fund('default')).toThrowError(defaultAddressNotFound)
  })
})
