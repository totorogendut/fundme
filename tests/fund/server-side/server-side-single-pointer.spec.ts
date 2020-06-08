import { fund } from "../../../src/fund/mod";

describe("single pointer server side", () => {
  test("single pointer returns a string", () => {
    const pointer = "$wallet.address.com/test1";

    expect(fund(pointer)).toBe(pointer);
  });

  test("single pointer doesn't takes weight custom syntax into consideration", () => {
    const pointer = "$wallet.address.com/test1";
    const customSyntax = "#44";

    expect(fund(pointer + customSyntax)).toBe(pointer);
  });

  test("doesn't generate meta tag", () => {
    fund("$wallet.example.com/test");

    expect(document.querySelector('meta[name="monetization"]')).toBe(null);
  });
});
