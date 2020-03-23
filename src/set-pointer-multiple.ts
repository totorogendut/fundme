import { getWinningPointer, setWebMonetizationPointer, getPoolChanceSum } from './utils'

export const DEFAULT_CHANCE: number = 5;

// TODO check pointer.address with RegEx
export function setPointerMultiple(pointers: Array<string | WMPointer>, maxPool?: number): void {
  const pool = createPool(pointers)
  const pickedPointer = pickPointer(pool)
  setWebMonetizationPointer(getPointerAddress(pickedPointer));
}

export function getPointerAddress(pointer: WMPointer): string {
  const address = pointer.address

  if (!address) {
    throw new Error(errors.addressNotFound)
  } else if (typeof address !== 'string') {
    throw new Error(errors.addressIsNotAString)
  }
  return address
}

export function createPool(pointers: Array<string | WMPointer>): WMPointer[] {
  return pointers.map(pointer => {
    let wmPointer: WMPointer;
    if (typeof pointer === "string") pointer = convertToPointer(pointer)
    if (!('address' in pointer)) throw new Error(errors.addressNotFound)
    wmPointer = stabilizeChance(pointer);

    return wmPointer;
  })
}

export function stabilizeChance(pointer: WMPointer): WMPointer {
  if (pointer.chance === undefined || pointer.chance === NaN) {
    console.warn(`Fundme.js: ${pointer.address} has chance that is not a number. It has been set to 5 (default).`);
    pointer.chance = DEFAULT_CHANCE;
  }

  return pointer;
}

// TODO getting pointer from pool
export function pickPointer(pointers: WMPointer[]): WMPointer {
  const sum = getPoolChanceSum(pointers)
  let choice: number = getChoice(sum)

  return getWinningPointer(pointers, choice)
}

export function getChoice(sum: number): number {
  const choice: number = Math.random() * sum

  return choice
}

export function convertToPointer(str: string): WMPointer {
  const pointer = {
    address: str,
    chance: DEFAULT_CHANCE
  }
  return pointer
}

const errors: any = {
  addressNotFound: "Fundme.js: address not found.",
  addressIsNotAString: "Fundme.js: address must be a string.",
  chanceNotFound: "Fundme.js: entries .chance not found.",
}