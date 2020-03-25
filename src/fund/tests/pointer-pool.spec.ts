import { getCurrentPointerPool, convertToPointerPool, fund } from '../main'

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
    fund()
    expect(getCurrentPointerPool()).toEqual(pointers)
    document.body.innerHTML = ''
  })

  test('convertToPointerPool ensure returning an array', () => {
    const pointer = '$coil.com/pointer'

    expect(convertToPointerPool(pointer)).toEqual([pointer])
  })
})
