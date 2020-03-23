import { DEFAULT_CHANCE } from './set-pointer-multiple'

export function isMultiplePointer(s: any): boolean {
  return Array.isArray(s)
}

export function setWebMonetizationPointer(address: string): HTMLMetaElement {
  let wmAddress: HTMLMetaElement = document.querySelector('meta[name="monetization"]');

  return setWebMonetizationTag(wmAddress, address)
}

export function setWebMonetizationTag(wmAddress: HTMLMetaElement, address: string): HTMLMetaElement {
  if (!wmAddress) {
    wmAddress = createWebMonetizationTag(address)
  } else {
    wmAddress.content = address
  }

  return wmAddress
}

export function createWebMonetizationTag(address: string): HTMLMetaElement {
  const wmAddress = document.createElement('meta')
  wmAddress.name = 'monetization'
  wmAddress.content = address
  document.head.appendChild(wmAddress)

  return wmAddress
}

export function getPoolChanceSum(pointers: WMPointer[]): number {
  const chances: number[] = pointers.map(pointer => pointer.chance)
  return Object.values(chances)
    .reduce((sum: number, weight: number): number => sum + weight, 0)
}

export function getWinningPointer(pointers: WMPointer[], choice: number): WMPointer {
  for (const pointer in pointers) {
    const weight: number = pointers[pointer].chance
    if ((choice -= weight) <= 0) {
      return pointers[pointer]
    }
  }
}