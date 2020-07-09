import { fund, getCurrentPointerAddress } from "../../../src/fund/mod";
import { forceFundmeOnBrowser } from "../../../src/fund/fund-browser";
import { invalidAddress } from "../../../src/fund/errors";

describe("correctly fund() argument", () => {
  test("get single pointer if parameter is a string", () => {
    forceFundmeOnBrowser();
    const myFundingType = fund("test");

    expect(myFundingType).toBe("single");
  });

  test("get multiple pointer if parameter is an array", () => {
    const myFundingType = fund(
      [
        "test",
        "address2",
        {
          address: "Wooooww",
          weight: 4,
        },
      ],
      { force: "client" },
    );

    expect(myFundingType).toBe("multiple");
  });

  test("get from templates if parameter is empty", () => {
    document.body.innerHTML = '<template data-fund="meta" />';
    forceFundmeOnBrowser();
    const myFundingType = fund();

    expect(myFundingType).toBe("template");
  });

  test("throw if fund() argument is not valid", () => {
    forceFundmeOnBrowser();
    // @ts-ignore
    expect(() => fund({})).toThrowError(invalidAddress);
  });

  test("client-side single pointer doesn't takes weight custom syntax into consideration", () => {
    const pointer = "$wallet.address.com/test1";
    const customSyntax = "#44";

    fund(pointer + customSyntax, { force: "client" });
    expect(getCurrentPointerAddress()).toBe(pointer);
  });
});
