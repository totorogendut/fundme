import {
  getWinningPointer,
  setWebMonetizationPointer,
  getPoolWeightSum,
  setCurrentPointer,
  hasAddress,
} from "./utils";
import { calculateRelativeWeight } from "./relative-weight";
import { addressNotFound, addressIsNotAString, FundmeError } from "./errors";
import { isBrowser } from "./fund-browser";

export const DEFAULT_WEIGHT: number = 5;

// TODO check pointer.address with RegEx
export function setPointerMultiple(
  pointers: (string | WMPointer)[],
  options: fundOptions = {},
): returnValidPointer {
  let pool: WMPointer[] = createPool(pointers);
  pool = calculateRelativeWeight(pool);
  const pickedPointer = pickPointer(pool);
  const pointerAddress = getPointerAddress(pickedPointer);
  setCurrentPointer(pool);

  if (isBrowser(options)) {
    return setWebMonetizationPointer(pointerAddress);
  }

  return pointerAddress;
}

export function getPointerAddress(pointer: WMPointer): string {
  const address = pointer.address;

  if (!address) {
    throw FundmeError(addressNotFound);
  } else if (typeof address !== "string") {
    throw FundmeError(addressIsNotAString);
  }
  return address;
}

export function createPool(pointers: Array<string | WMPointer>): WMPointer[] {
  return pointers.map((pointer) => {
    let wmPointer: WMPointer;
    if (typeof pointer === "string") pointer = convertToPointer(pointer);
    if (!hasAddress(pointer)) throw FundmeError(addressNotFound);
    wmPointer = checkWeight(pointer);

    return wmPointer;
  });
}

// TODO update checkWeight to use relative weight instead
export function checkWeight(pointer: WMPointer): WMPointer {
  if (pointer.weight === undefined || pointer.weight === NaN) {
    // if (window) console.warn(weightIsNotANumber(pointer.address));
    pointer.weight = DEFAULT_WEIGHT;
  }

  return pointer;
}

export function pickPointer(pointers: WMPointer[]): WMPointer {
  const sum = getPoolWeightSum(pointers);
  let choice: number = getChoice(sum);

  return getWinningPointer(pointers, choice);
}

export function getChoice(sum: number): number {
  const choice: number = Math.random() * sum;

  return choice;
}

export function convertToPointer(str: string): WMPointer {
  let address: string = str;
  let weight!: weight;
  const split: string[] = str.split("#");

  if (split.length > 1) {
    address = split[0];
    weight = split[1];
  }

  const pointer: WMPointer = {
    address,
    weight,
  };

  return checkWeight(pointer);
}
