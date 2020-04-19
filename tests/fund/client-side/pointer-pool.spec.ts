import { getCurrentPointerPool, fund } from '../../../src/fund/main'
import { forceFundmeOnBrowser } from '../../../src/fund/fund-browser'
import { convertToPointerPool } from '../../../src/fund/utils'

describe('test getCurrentPointerPool()', () => {
  test('it returns correct pool', () => {
    const pointers = [
      {
        address: '$coil.com/pointer-test',
        weight: 44,
      },
      {
        address: '$coil.com/pointer-test2',
        weight: 33,
      },
    ]
    document.body.innerHTML = `
      <script fundme type="application/json">
        ${JSON.stringify(pointers)}
      </script>
    `
    forceFundmeOnBrowser()
    fund()
    expect(getCurrentPointerPool()).toEqual(pointers)
    document.body.innerHTML = ''
  })

  test('convertToPointerPool ensure returning an array', () => {
    const pointer = '$coil.com/pointer'

    expect(convertToPointerPool(pointer)).toEqual([pointer])
  })
})
