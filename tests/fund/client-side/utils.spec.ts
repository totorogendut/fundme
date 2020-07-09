import {
  isMultiplePointer,
  getPoolWeightSum,
  getWinningPointer,
  isNumberOnly,
  convertToPointerPool,
} from "../../../src/fund/utils";
import { getCurrentPointerAddress } from "../../../src/fund/mod";
import { forceFundmeOnBrowser } from "../../../src/fund/fund-browser";
import {
  metaTagNotFound,
  FundmeError,
  getWinningPointerMustBeANumber,
} from "../../../src/fund/errors";

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
      address: "$wallet.example.com/first-pointer",
      weight: 48,
    },
    {
      address: "$wallet.example.com/winning-pointer",
      weight: 22,
    },
    {
      address: "$wallet.example.com/not-winning-pointer",
      weight: 45,
    },
    {
      address: "$wallet.example.com/pointer-with-default-weight",
    },
  ];
  const choice = 50;
  test("get correct sum for pool weight", () => {
    expect(getPoolWeightSum(myPointers)).toBe(120);
  });

  test("pick correct winning pointer from pool", () => {
    expect(getWinningPointer(myPointers, choice).address).toBe(
      "$wallet.example.com/winning-pointer",
    );
  });

  describe("pickPointer() add default weight", () => {
    const noWeightPointer = [
      {
        address: "$wallet.example.com/zero-weight-address",
        weight: 0,
      },
      {
        address: "$wallet.example.com/undefined-weight-address",
      },
    ];
    expect(getWinningPointer(noWeightPointer, 4).address).toBe(
      "$wallet.example.com/undefined-weight-address",
    );
  });

  test("getWinningPointer returns first item in pool if choice greater than pool's weight", () => {
    expect(getWinningPointer(myPointers, 1000).address).toBe("$wallet.example.com/first-pointer");
  });

  test("winning pointer's weight must be a number", () => {
    const invalidPointer = [
      {
        address: "$wallet.example/test-invalid",
        weight: true,
      },
    ];
    expect(() => getWinningPointer(invalidPointer, 11)).toThrow(
      FundmeError(getWinningPointerMustBeANumber),
    );
  });
});

describe("test getCurrentPointerAddress() when there's no meta tag", () => {
  test("throw not found", () => {
    forceFundmeOnBrowser();
    expect(() => getCurrentPointerAddress()).toThrowError(FundmeError(metaTagNotFound));
  });
});

describe("ensure logic filters work as expected", () => {
  test("testing isNumberOnly()", () => {
    expect(isNumberOnly("55")).toBeTruthy();
    expect(isNumberOnly(44)).toBeTruthy();
    expect(isNumberOnly({})).toBeFalsy();
    expect(isNumberOnly(["testing"])).toBeFalsy();
    expect(isNumberOnly("4423sd2")).toBeFalsy();
  });
});

describe("convert multiple pointer pool", () => {
  test("undefined parameter returns an empty array", () => {
    expect(convertToPointerPool(undefined)).toEqual([]);
  });
});
