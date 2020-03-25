import { fund, getCurrentPointerPool } from '../main'

import {
  toBeInTheDocument,
  toHaveAttribute,
} from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })

describe('parsing fundme template from a JSON array', () => {
  test('fund() will scrape from <script fundme type="application/json">', () => {
    // const pointerAddress = '$coil.com/pointer-address1'
    document.body.innerHTML = `
      <script fundme type="application/json">
        [
          "$coil.com/my-pointer",
          {
            "address": "$xrp.com/tip-my-content",
            "weight": 8
          }
        ]
      </script>
    `
    fund()
    const pool = getCurrentPointerPool()
    // @ts-ignore
    expect(pool[1].weight).toBe(8)
    document.body.innerHTML = ''
  })
})