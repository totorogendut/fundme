import { fund, getCurrentPointerPool } from "../../../src/fund/mod";
import { forceFundmeOnBrowser } from "../../../src/fund/fund-browser";
import { cleanSinglePointerSyntax } from "../../../src/fund/utils";
import { FundmeError, canOnlyCleanStringCustomSyntax } from "../../../src/fund/errors";

describe("Unique syntax on string", () => {
  test("will result correct weights", () => {
    forceFundmeOnBrowser();
    fund(["$wallet.example.com/testing-1#33", "$wallet.example.com/testing-2#22"]);

    const expectedPool = [
      {
        address: "$wallet.example.com/testing-1",
        weight: 33,
      },
      {
        address: "$wallet.example.com/testing-2",
        weight: 22,
      },
    ];

    expect(getCurrentPointerPool()).toEqual(expectedPool);
  });

  test("clean custom syntax", () => {
    expect(cleanSinglePointerSyntax("$wallet.address.com/test#33")).toBe(
      "$wallet.address.com/test",
    );
  });

  test("can only clean string", () => {
    expect(() => cleanSinglePointerSyntax(4)).toThrowError(
      FundmeError(canOnlyCleanStringCustomSyntax),
    );
    expect(() => cleanSinglePointerSyntax({})).toThrowError(
      FundmeError(canOnlyCleanStringCustomSyntax),
    );
    expect(() => cleanSinglePointerSyntax(["$wallet.example.com/address"])).toThrowError(
      FundmeError(canOnlyCleanStringCustomSyntax),
    );
  });
});
