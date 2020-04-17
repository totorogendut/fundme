import { fund, FundType, forceFundmeOnBrowser } from '../../../src/fund/main'
import { invalidAddress } from '../../../src/fund/errors'

describe('correctly fund() argument', () => {
  test('get single pointer if parameter is a string', () => {
    forceFundmeOnBrowser()
    const myFundingType = fund('test')

    expect(myFundingType).toBe(FundType.isSingle)
  })

  test('get multiple pointer if parameter is an array', () => {
    forceFundmeOnBrowser()
    const myFundingType = fund([
      'test',
      'address2',
      {
        address: 'Wooooww',
        weight: 4,
      },
    ])

    expect(myFundingType).toBe(FundType.isMultiple)
  })

  test('get from templates if parameter is empty', () => {
    document.body.innerHTML = '<template data-fund="meta" />'
    forceFundmeOnBrowser()
    const myFundingType = fund()

    expect(myFundingType).toBe(FundType.isFromTemplate)
  })

  test('throw if fund() argument is not valid', () => {
    forceFundmeOnBrowser()
    // @ts-ignore
    expect(() => fund({})).toThrowError(invalidAddress)
  })
})
