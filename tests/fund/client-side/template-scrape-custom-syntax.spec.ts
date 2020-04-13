import { fund, getCurrentPointerPool, forceFundmeOnBrowser } from '../../../src/fund/main'

import { toBeInTheDocument, toHaveAttribute } from '@testing-library/jest-dom/matchers'
import { scriptFundmeIsNotApplicationJson } from '../../../src/fund/errors'

expect.extend({ toBeInTheDocument, toHaveAttribute })

describe('parsing custom syntax', () => {
  test('works with hash # weight modifier', () => {
    forceFundmeOnBrowser()
    document.body.innerHTML = `
      <template fundme>
        $wallet.example.com/testing-one#22;
        $wallet.example.com/testing-two#44;
        $wallet.example.com/testing-three#33;
      </template>
    `
    fund()
    const expectedPool = [
      {
        address: '$wallet.example.com/testing-one',
        weight: 22,
      },
      {
        address: '$wallet.example.com/testing-two',
        weight: 44,
      },
      {
        address: '$wallet.example.com/testing-three',
        weight: 33,
      },
    ]

    expect(getCurrentPointerPool()).toEqual(expectedPool)
    document.body.innerHTML = ''
  })
  test('works with a pointer with no weight explicitly stated', () => {
    document.body.innerHTML = `
      <template fundme>
        $wallet.example.com/testing-one;
        $wallet.example.com/testing-two#44;
        $wallet.example.com/testing-three#33;
      </template>
    `
    forceFundmeOnBrowser()
    fund()
    const expectedPool = [
      {
        address: '$wallet.example.com/testing-one',
        weight: 5,
      },
      {
        address: '$wallet.example.com/testing-two',
        weight: 44,
      },
      {
        address: '$wallet.example.com/testing-three',
        weight: 33,
      },
    ]

    expect(getCurrentPointerPool()).toEqual(expectedPool)
    document.body.innerHTML = ''
  })
})
