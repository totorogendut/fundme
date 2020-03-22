import { DEFAULT_CHANCE } from './set-pointer-multiple'

export function isMultiplePointer(s: any): boolean {
  return Array.isArray(s)
}

export function setWebMonetizationPointer(address: string): HTMLMetaElement {
  let wmAddress: HTMLMetaElement = document.querySelector('meta[name="monetization"]');

  if (!wmAddress) {
    wmAddress = document.createElement('meta')
    wmAddress.name = 'monetization'
    wmAddress.content = address;
    document.head.appendChild(wmAddress)
  } else {
    wmAddress.content = address;
  }

  return wmAddress
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
  const chances = pointers.map(pointer => pointer.chance)
  const sum = Object.values(chances).reduce((sum: number, weight: number): number => sum + weight, 0)

  let choice = Math.random() * sum

  for (const pointer in pointers) {
    const weight: number = pointers[pointer].chance
    if ((choice -= weight) <= 0) {
      return pointers[pointer]
    }
  }
}