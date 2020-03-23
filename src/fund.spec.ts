import fund, { setDefaultAddress, FundType, defaultAddress } from './main'

describe('get correct fund() argument', () => {
  test('get single pointer if argument is a string', () => {
    const myFundingType = fund('test')

    expect(myFundingType).toBe(FundType.isSingle)
  })

  test('get multiple pointer if argument is an array', () => {
    const myFundingType = fund(['test', 'address2', {
      address: 'Wooooww',
      chance: 4
    }])

    expect(myFundingType).toBe(FundType.isMultiple)
  })

  test('throw if fund() has no argument and default address hasn\'t been set', () => {
    expect(() => fund()).toThrowError(/fallback is not found/)
  })
  test('throw if fund() argument is not valid', () => {
    // @ts-ignore
    expect(() => fund({})).toThrowError(/Invalid Web Monetization/)
  })
  test('fund() will use default address if possible', () => {
    setDefaultAddress('my default address')
    expect(fund()).toBe(FundType.isDefault)
  })
})

describe('default pointer', () => {
  test('correctly set default pointer', () => {
    setDefaultAddress('default 1')
    expect(defaultAddress).toBe('default 1')
  })

  test('fund() with options.default will set default address', () => {
    fund('default 2', { default: true })
    expect(defaultAddress).toBe('default 2')
  })

  test('fund() with options.default only accept single string', () => {

    expect(() => fund(['string 1', { address: 'testing', chance: 22 }], { default: true }))
      .toThrow()
  })
})