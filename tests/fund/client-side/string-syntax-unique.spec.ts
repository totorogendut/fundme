import { fund, getCurrentPointerPool } from '../../../src/fund/main'
import { forceFundmeOnBrowser } from '../../../src/fund/fund-browser'

describe('Unique syntax on string', () => {
  test('will result correct weights', () => {
    forceFundmeOnBrowser()
    fund(['$wallet.example.com/testing-1#33', '$wallet.example.com/testing-2#22'])

    const expectedPool = [
      {
        address: '$wallet.example.com/testing-1',
        weight: 33,
      },
      {
        address: '$wallet.example.com/testing-2',
        weight: 22,
      },
    ]

    expect(getCurrentPointerPool()).toEqual(expectedPool)
  })
})
