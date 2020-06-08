import { fund, getCurrentPointerPool } from "../../../src/fund/mod";
import { forceFundmeOnBrowser } from "../../../src/fund/fund-browser";

import { toBeInTheDocument, toHaveAttribute } from "@testing-library/jest-dom/matchers";
import { scriptFundmeIsNotApplicationJson } from "../../../src/fund/errors";

expect.extend({ toBeInTheDocument, toHaveAttribute });

describe("parsing fundme template from a JSON array", () => {
  test('fund() will scrape from <script fundme type="application/json">', () => {
    document.body.innerHTML = `
    <script fundme type="application/json">
    [
      "$coil.xrptipbot.com/my-pointer",
      {
        "address": "$xrp.com/tip-my-content",
        "weight": 8
      }
    ]
    </script>
    `;
    forceFundmeOnBrowser();
    fund();
    const pool = getCurrentPointerPool();
    // @ts-ignore
    expect(pool[0].address).toBe("$coil.xrptipbot.com/my-pointer");
    document.body.innerHTML = "";
  });
  test("<script fundme> accepts single string", () => {
    document.body.innerHTML = `
      <script fundme type="application/json">
        "$coil.xrptipbot.com/my-pointer"
      </script>
    `;
    forceFundmeOnBrowser();
    fund();
    const pool = getCurrentPointerPool();
    // @ts-ignore
    expect(pool[0].address).toBe("$coil.xrptipbot.com/my-pointer");
    document.body.innerHTML = "";
  });

  test('<script fundme> must have MIME type "application/json"', () => {
    // const pointerAddress = '$coil.com/pointer-address1'
    document.body.innerHTML = `
      <script fundme>
        [
          "$coil.com/my-pointer",
          {
            "address": "$xrp.com/tip-my-content",
            "weight": 8
          }
        ]
      </script>
    `;
    forceFundmeOnBrowser();
    // @ts-ignore
    expect(() => fund()).toThrowError(scriptFundmeIsNotApplicationJson);
    document.body.innerHTML = "";
  });
});
