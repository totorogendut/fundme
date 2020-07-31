import { FundmeError, splitFundError } from "../../../src/fund/errors";
import { fund } from "../../../src/fund/fund";
import { splitFund } from "../../../src/fund/split";
import { setCurrentPointer } from "../../../src/fund/utils";

describe("split fund works as expected", () => {
  test("it split correct amount", () => {
    fund([
      "$wallet.example/test-1#10",
      "$wallet.example/test-2#20",
      "$wallet.example/platform#30%",
    ]);
    const amount = 60;
    expect(splitFund(amount)).toEqual([
      {
        address: "$wallet.example/test-1",
        amount: 14,
        weight: 7,
      },
      {
        address: "$wallet.example/test-2",
        amount: 28,
        weight: 14,
      },
      {
        address: "$wallet.example/platform",
        amount: 18,
        weight: 9,
      },
    ]);
  });

  test("it throw an error if pointers haven't yet initiated", () => {
    setCurrentPointer([]);
    expect(() => splitFund(1)).toThrowError(FundmeError(splitFundError));
  });
});
