import { fund, getCurrentPointerPool } from '../main'

import {
  toBeInTheDocument,
  toHaveAttribute,
} from '@testing-library/jest-dom/matchers'

expect.extend({ toBeInTheDocument, toHaveAttribute })

describe('get weight from <template data-fund-weight="xx" />', () => {
  test('fund() will scrape from template', () => {
    const pointerAddress = '$coil.com/pointer-address1'
    document.body.innerHTML = `
      <template data-fund="${pointerAddress}" data-fund-weight="52" ></template>
      <template data-fund="${pointerAddress}2" data-fund-weight="22" />
    `
    fund()
    const pool = getCurrentPointerPool()
    console.log(JSON.stringify(pool))
    // @ts-ignore
    expect(pool[0].weight).toBe(52)
    document.body.innerHTML = ''
  })
})