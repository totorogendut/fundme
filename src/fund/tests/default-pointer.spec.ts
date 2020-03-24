import { fund, setDefaultAddress, defaultAddress, } from '../main'
import { defaultAddressNotFound } from '../errors'

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