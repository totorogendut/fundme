import { isMultiplePointer, getPoolWeightSum, getWinningPointer } from "../../../src/fund/utils";
import { getCurrentPointerAddress } from "../../../src/fund/mod";
import { forceFundmeOnBrowser } from "../../../src/fund/fund-browser";
import { metaTagNotFound, FundmeError } from "../../../src/fund/errors";

//@ts-ignore
import { toBeInTheDocument, toHaveAttribute } from "@testing-library/jest-dom/matchers";

expect.extend({ toBeInTheDocument, toHaveAttribute });

describe("check multiple pointers correctly", () => {
  test("if pointer is array", () => {
    const arr = [];
    const arr2 = ["1", 3];

    expect(isMultiplePointer(arr)).toBeTruthy();
    expect(isMultiplePointer(arr2)).toBeTruthy();
  });
  test("if pointer is object", () => {
    const obj = {
      address: "myaddress",
      weight: 10,
    };

    expect(isMultiplePointer(obj)).toBeFalsy();
  });
  test("if pointer is number", () => {
    const randNumber = 14235123;

    expect(isMultiplePointer(randNumber)).toBeFalsy();
  });
  test("if pointer is string", () => {
    const randString = "Wwooooweeeee";

    expect(isMultiplePointer(randString)).toBeFalsy();
  });
});

describe("ensure pickPointer() is robust", () => {
  const myPointers = [
    {
      address: "coolguy",
      weight: 33,
    },
    {
      address: "someother guy",
      weight: 22,
    },
    {
      address: "is doesn't matter",
      weight: 45,
    },
  ];
  const choice = 50;
  test("get correct sum for pool weight", () => {
    expect(getPoolWeightSum(myPointers)).toBe(100);
  });

  test("pick correct winning pointer from pool", () => {
    expect(getWinningPointer(myPointers, choice).address).toBe("someother guy");
  });
});

describe("test getCurrentPointerAddress() when there's no meta tag", () => {
  test("throw not found", () => {
    forceFundmeOnBrowser();
    expect(() => getCurrentPointerAddress()).toThrowError(FundmeError(metaTagNotFound));
  });
});
