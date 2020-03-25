import { fund, setDefaultAddress, getCurrentPointerAddress, getCurrentPointerPool } from '../main'
import { defaultAddressNotFound } from '../errors'
import { DEFAULT_WEIGHT } from '../set-pointer-multiple'

describe('default pointer', () => {
  test('correctly set default pointer for single paramter', () => {
    setDefaultAddress('default 1')
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

    fund('default')
    expect(getCurrentPointerPool()).toEqual(expectedPointers)
  })
  test("throw if using default but default address hasn't been set", () => {
    setDefaultAddress(undefined)
    expect(() => fund('default')).toThrowError(defaultAddressNotFound)
  })
})
