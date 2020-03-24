import { fund, setDefaultAddress, FundType, defaultAddress, } from './main'
import { defaultAddressNotFound, invalidAddress } from './errors'

describe('correctly fund() argument', () => {
  test('get single pointer if parameter is a string', () => {
    const myFundingType = fund('test')

    expect(myFundingType).toBe(FundType.isSingle)
  })

  test('get multiple pointer if parameter is an array', () => {
    const myFundingType = fund(['test', 'address2', {
      address: 'Wooooww',
      weight: 4
    }])

    expect(myFundingType).toBe(FundType.isMultiple)
  })
  test('get from templates if parameter is empty', () => {
    const myFundingType = fund()

    expect(myFundingType).toBe(FundType.isFromTemplate)
  })


  test('throw if fund() argument is not valid', () => {
    // @ts-ignore
    expect(() => fund({})).toThrowError(invalidAddress)
  })
})

describe('default pointer', () => {
  test('correctly set default pointer', () => {
    setDefaultAddress('default 1')
    expect(defaultAddress).toBe('default 1')
  })

  test('throw if using default but default address hasn\'t been set', () => {
    setDefaultAddress(undefined)
    expect(() => fund('default')).toThrowError(defaultAddressNotFound)
  })
})