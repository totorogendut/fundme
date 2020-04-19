import { fund } from '../../../src/fund/main'

describe('single pointer server side', () => {
  test('single pointer returns a string', () => {
    const pointer = '$wallet.address.com/test1'

    expect(fund(pointer)).toBe(pointer)
  })

  test("single pointer doesn't takes weight custom syntax into consideration", () => {
    const pointer = '$wallet.address.com/test1'
    const customSyntax = '#44'

    expect(fund(pointer + customSyntax)).toBe(pointer)
  })
})
