import { setWebMonetizationPointer, getPoolChanceSum } from './utils'

export const DEFAULT_CHANCE: number = 5;

// TODO check pointer.address with RegEx
export function setPointerMultiple(pointers: Array<string | WMPointer>, maxPool?: number): void {
  const pool = pointers.map(pointer => {
    let wmPointer: WMPointer;
    if (typeof pointer === "string") pointer = convertToPointer(pointer)
    if (!('address' in pointer)) throw new Error(errors.addressNotFound)
    wmPointer = stabilizeChance(pointer);

    return wmPointer;
  })

  const selectedPointer: string = pickPointer(pool).address;
  setWebMonetizationPointer(selectedPointer);
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
  let choice = Math.random() * sum

  for (const pointer in pointers) {
    const weight: number = pointers[pointer].chance
    if ((choice -= weight) <= 0) {
      return pointers[pointer]
    }
  }
}

export function convertToPointer(s: string): WMPointer {
  const pointer = {
    address: s,
    chance: DEFAULT_CHANCE
  }
  return pointer
}

const errors: any = {
  addressNotFound: "Fundme.js: address not found not found.",
  chanceNotFound: "Fundme.js: entries .chance not found.",
}