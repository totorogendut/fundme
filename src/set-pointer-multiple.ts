import { setWebMonetizationPointer, stabilizeChance, pickPointer } from './utils'

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