import { metaTagNotFound } from '../../../src/fund/errors'
import { getCurrentPointerAddress } from '../../../src/fund/main'

describe('no currentpointer atm', () => {
  document.head.innerHTML = ''
  test('throw not found', () => {
    expect(() => getCurrentPointerAddress()).toThrowError(metaTagNotFound)
  })
})

describe('testing getCurrentPointer()', () => {
  test('get pointer address', () => {
    const pointerAddress = '$coil.com/testing'
    document.head.innerHTML = `<meta name="monetization" content=${pointerAddress} />`
    expect(getCurrentPointerAddress()).toBe(pointerAddress)
    document.head.innerHTML = ''
  })
})
