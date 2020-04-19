import {
  fund,
  setDefaultAddress,
  getCurrentPointerAddress,
  getCurrentPointerPool,
} from '../../../src/fund/main'
import { forceFundmeOnBrowser } from '../../../src/fund/fund-browser'
import {
  defaultAddressNotFound,
  invalidDefaultAddress,
  defaultAddressArrayCannotBeEmpty,
  FundmeError,
} from '../../../src/fund/errors'
import { DEFAULT_WEIGHT } from '../../../src/fund/set-pointer-multiple'
import { getDefaultAddress } from '../../../src/fund/utils'

describe('default pointer', () => {
  test('correctly set default pointer for single paramter', () => {
    setDefaultAddress('$wallet.example.com/test1')
    forceFundmeOnBrowser()
    fund('default')
    expect(getCurrentPointerAddress()).toBe('$wallet.example.com/test1')
  })
  test('correctly set default pointer for single paramter with object', () => {
    setDefaultAddress({ address: '$wallet.example.com/test2' })
    forceFundmeOnBrowser()
    fund('default')
    expect(getCurrentPointerAddress()).toBe('$wallet.example.com/test2')
  })

  test('set default address with multiple pointers', () => {
    const pointers = [
      '$twitter.com/my-address', //@ts-ignore
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

  test('throw if default address not found', () => {
    //@ts-ignore
    expect(() => {
      setDefaultAddress(undefined, { allowUndefined: true }) //@ts-ignore
      fund('default', { force: 'client' })
    }).toThrowError(FundmeError(defaultAddressNotFound))
  })

  test('throw if default address undefined', () => {
    //@ts-ignore
    expect(() => {
      setDefaultAddress(undefined) //@ts-ignore
    }).toThrowError(FundmeError(invalidDefaultAddress))
  })

  test('throw if default address invalid', () => {
    const set = (any) => {
      setDefaultAddress(any)
      console.log('Default address is', getDefaultAddress())
    }
    //@ts-ignore
    expect(() => set({})).toThrowError(FundmeError(invalidDefaultAddress))
    //@ts-ignore
    expect(() => set(4)).toThrowError(FundmeError(invalidDefaultAddress))
  })
  test('throw if default address is array but empty', () => {
    const set = (any) => {
      setDefaultAddress(any)
      console.log('Default address is', getDefaultAddress())
    }
    //@ts-ignore
    expect(() => set([])).toThrowError(FundmeError(defaultAddressArrayCannotBeEmpty))
  })
})
