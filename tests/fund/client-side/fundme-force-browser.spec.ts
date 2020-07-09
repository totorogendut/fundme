import { fund } from "../../../src/fund/mod";
import { isBrowser, forceFundmeOnBrowser, clientSideFund } from "../../../src/fund/fund-browser";

//@ts-ignore
import { toBeInTheDocument, toHaveAttribute } from "@testing-library/jest-dom/matchers";
import { FundType } from "../../../src/fund/fund";
import { FundmeError, invalidFundmeServerSide } from "../../../src/fund/errors";

expect.extend({ toBeInTheDocument, toHaveAttribute });

describe("force fund() on browser", () => {
  test("force single pointer fund() on browser", () => {
    const pointer = "$wallet.example.com/test1";

    fund(pointer, {
      force: "client",
    });

    const meta = document.querySelector('meta[name="monetization"]');

    expect(meta).toBeInTheDocument();
    expect(meta).toHaveAttribute("content", pointer);
  });

  test("force multiple pointer fund() on browser", () => {
    const pointers = ["$wallet.example.com/test1", "$wallet.example.com/test2"];

    fund(pointers, {
      force: "client",
    });

    const meta = document.querySelector('meta[name="monetization"]')! as HTMLMetaElement;

    expect(meta).toBeInTheDocument();
    expect(meta.content).toContain("$wallet.example.com/test");
  });
});

describe("test isBrowser()", () => {
  test("force client is enabled", () => {
    expect(isBrowser({ force: "client" })).toBeTruthy();
  });
  test("force server is enabled", () => {
    expect(isBrowser({ force: "server" })).toBeFalsy();
  });
  test("without forcing in node environment", () => {
    expect(isBrowser()).toBeFalsy();
  });
  test("throw error if forcing client and server in conflict", () => {
    const pointer = "$wallet.example.com/test1";

    expect(() => {
      clientSideFund(pointer, {
        force: "server",
      });
    }).toThrowError(FundmeError(invalidFundmeServerSide));
  });
});
