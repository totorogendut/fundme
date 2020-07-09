import { fund } from "../../../src/fund/mod";
import {
  noUndefinedFundOnServerSide,
  invalidFundmeServerSide,
  FundmeError,
} from "../../../src/fund/errors";

describe("multiple pointer server side", () => {
  test("server-side fund() with custom syntax weight modifier", () => {
    const pointer = [
      "$wallet.address.com/with-weight-six#6",
      "$wallet.address.com/with-weight-ten#10",
      "$wallet.address.com/test#0",
      "$wallet.address.com/testing#0",
      "$wallet.address.com/fake-address#0",
    ];
    expect(fund(pointer)).toContain("with-weight");
  });

  test("server-side fund() can't scrape from templates", () => {
    expect(() => fund()).toThrowError(FundmeError(noUndefinedFundOnServerSide));
    expect(() => fund(undefined)).toThrowError(FundmeError(noUndefinedFundOnServerSide));
    expect(() => fund(null)).toThrowError(FundmeError(noUndefinedFundOnServerSide));
  });

  test("server-side fund() no invalid parameters", () => {
    const invalidPointer = {};
    const invalidPointer2 = 4444;
    //@ts-ignore
    expect(() => fund(invalidPointer)).toThrowError(FundmeError(invalidFundmeServerSide));
    //@ts-ignore
    expect(() => fund(invalidPointer2)).toThrowError(FundmeError(invalidFundmeServerSide));
  });
});
