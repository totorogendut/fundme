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

export function getPoolChanceSum(pointers: WMPointer[]): number {
  const chances: number[] = pointers.map(pointer => pointer.chance)
  return Object.values(chances)
    .reduce((sum: number, weight: number): number => sum + weight, 0)
}