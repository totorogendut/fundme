import { createPool, getPointerAddress, DEFAULT_WEIGHT } from "./set-pointer-multiple";
import { isBrowser } from "./fund-browser";
import { FundType } from "./fund";
import {
  metaTagNotFound,
  metaTagMultipleIsFound,
  getCurrentPointerAddressMustClientSide,
  FundmeError,
  canOnlyCleanStringCustomSyntax,
  defaultAddressArrayCannotBeEmpty,
  invalidDefaultAddress,
  getWinningPointerMustBeANumber,
} from "./errors";

export function isMultiplePointer(s: any): boolean {
  return Array.isArray(s);
}

export function setWebMonetizationPointer(address: string): HTMLMetaElement {
  let wmAddress = document.head.querySelector('meta[name="monetization"]')! as HTMLMetaElement;

  return setWebMonetizationTag(wmAddress, address);
}

export function setWebMonetizationTag(
  wmAddress: HTMLMetaElement,
  address: string,
): HTMLMetaElement {
  if (!wmAddress) {
    wmAddress = createWebMonetizationTag(address);
  } else {
    wmAddress.content = address;
  }

  return wmAddress;
}

export function createWebMonetizationTag(address: string): HTMLMetaElement {
  const wmAddress = document.createElement("meta");
  wmAddress.name = "monetization";
  wmAddress.content = address;
  document.head.appendChild(wmAddress);

  return wmAddress;
}

export function getPoolWeightSum(pointers: WMPointer[]): number {
  const weights: weight[] = pointers.map((pointer) => {
    return pointer.weight ?? DEFAULT_WEIGHT; // TODO - safecheck null assertion
  });

  return Object.values(weights).reduce((sum: number, weight: weight): number => {
    if (isNumberOnly(weight)) {
      if (typeof weight === "string") weight = parseFloat(weight);
      return sum + weight;
    } else {
      return sum;
    }
  }, 0);
}

export function getWinningPointer(pointers: WMPointer[], choice: number): WMPointer | undefined {
  for (const pointer in pointers) {
    const weight: weight = pointers[pointer].weight ?? DEFAULT_WEIGHT; // TODO - safecheck null assertion

    if (typeof weight !== "number") throw FundmeError(getWinningPointerMustBeANumber);

    if ((choice -= weight) <= 0) {
      return pointers[pointer];
    }
  }
}

export function hasAddress(obj: any): boolean {
  if (!obj) return false;

  return Object.keys(obj).some((str) => str === "address");
}

let defaultAddress: defaultAddress;
export function setDefaultAddress(
  address: defaultAddress,
  options: defaultAddressOptions = {},
): void {
  if (Array.isArray(address)) {
    if (address.length) {
      defaultAddress = createPool(address);
      return;
    } else {
      throw FundmeError(defaultAddressArrayCannotBeEmpty);
    }
  }

  if (typeof address === "string") {
    defaultAddress = address;
    return;
  }

  if (hasAddress(address)) {
    defaultAddress = getPointerAddress(address);
    return;
  }

  if (options.allowUndefined && address === undefined) {
    // @ts-ignore
    defaultAddress = undefined; // TODO check if ts-ignore break things
    return;
  }

  throw FundmeError(invalidDefaultAddress);
}

export function getDefaultAddress(): defaultAddress {
  return defaultAddress;
}

export function defaultAddressMultiple(address: defaultAddress): any {
  return isMultiplePointer(address) ? address : [address];
}

export let currentFundType: FundType;
export function setFundType(type: FundType): FundType {
  currentFundType = type;

  return currentFundType;
}

export let currentPointer: WMAddress;
export function setCurrentPointer(pointer: string | WMPointer[]) {
  currentPointer = pointer;
}

export function getCurrentPointerAddress(): string {
  // const forced = forceBrowser
  if (isBrowser()) {
    const metaTag: NodeListOf<HTMLMetaElement> = document.head.querySelectorAll(
      'meta[name="monetization"]',
    );

    if (metaTag.length > 1) {
      throw FundmeError(metaTagMultipleIsFound);
    }

    if (metaTag[0]) {
      return metaTag[0].content;
    }
    throw FundmeError(metaTagNotFound);
  } else {
    if (currentPointer) return currentPointer.toString();
    throw FundmeError(getCurrentPointerAddressMustClientSide);
  }
}

export function cleanSinglePointerSyntax(pointer: any): any {
  if (typeof pointer === "string") {
    pointer = pointer.split("#")[0];
  } else {
    throw FundmeError(canOnlyCleanStringCustomSyntax);
  }

  return pointer;
}

export function getCurrentPointerPool(): Array<string | WMPointer> {
  let pointer = currentPointer;

  return convertToPointerPool(pointer);
}

export function convertToPointerPool(pointer: WMAddress): Array<string | WMPointer> {
  if (!Array.isArray(pointer) && pointer !== undefined) {
    pointer = [pointer];
  }

  return pointer || [];
}

export function isNumberOnly(text: unknown): boolean {
  if (typeof text === "string") {
    const regex = /^[0-9]*$/;

    return regex.test(text);
  }

  return typeof text === "number";
}
