import { createPool } from './set-pointer-multiple'
import { isBrowser } from '../fund/fund-browser'
import {
  metaTagNotFound,
  metaTagMultipleIsFound,
  getCurrentPointerAddressMustClientSide,
  FundmeError,
} from './errors'

export function isMultiplePointer(s: any): boolean {
  return Array.isArray(s)
}

export function setWebMonetizationPointer(address: string): HTMLMetaElement {
  let wmAddress: HTMLMetaElement = document.querySelector('meta[name="monetization"]')

  return setWebMonetizationTag(wmAddress, address)
}

export function setWebMonetizationTag(
  wmAddress: HTMLMetaElement,
  address: string,
): HTMLMetaElement {
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

export function getPoolWeightSum(pointers: WMPointer[]): number {
  const weights: number[] = pointers.map((pointer) => pointer.weight)
  return Object.values(weights).reduce((sum: number, weight: number): number => sum + weight, 0)
}

export function getWinningPointer(pointers: WMPointer[], choice: number): WMPointer {
  for (const pointer in pointers) {
    const weight: number = pointers[pointer].weight
    if ((choice -= weight) <= 0) {
      return pointers[pointer]
    }
  }
}

let defaultAddress: WMAddress
export function setDefaultAddress(address: WMAddress): void {
  if (Array.isArray(address)) {
    defaultAddress = createPool(address)
  } else {
    defaultAddress = address
  }
}

export function getDefaultAddress(): WMAddress {
  return defaultAddress
}

export let currentFundType: FundType
export function setFundType(type: FundType): FundType {
  currentFundType = type

  return currentFundType
}

export let currentPointer: WMAddress
export function setCurrentPointer(pointer: string | WMPointer[]) {
  currentPointer = pointer
}

export function getCurrentPointerAddress(): string {
  // const forced = forceBrowser
  if (isBrowser()) {
    const metaTag: NodeListOf<HTMLMetaElement> = document.head.querySelectorAll(
      'meta[name="monetization"]',
    )

    if (metaTag.length > 1) {
      throw FundmeError(metaTagMultipleIsFound)
    }

    if (metaTag[0]) {
      return metaTag[0].content
    }
    throw FundmeError(metaTagNotFound)
  } else {
    if (currentPointer) return currentPointer.toString()
    throw FundmeError(getCurrentPointerAddressMustClientSide)
  }
}

export function getCurrentPointerPool(): Array<string | WMPointer> {
  let pointer = currentPointer

  return convertToPointerPool(pointer)
}

export function convertToPointerPool(pointer: WMAddress): Array<string | WMPointer> {
  if (!Array.isArray(pointer)) {
    pointer = [pointer]
  }

  return pointer
}
