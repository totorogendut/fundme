import { createPool } from './set-pointer-multiple'
import {
  metaTagNotFound,
  metaTagMultipleIsFound,
  noUndefinedFundOnServerSide,
  getCurrentPointerAddressMustClientSide,
  FundmeError,
} from './errors'
import { clientSideFund } from './main-client'
import { serverSideFund } from './main-server'

export let defaultAddress: WMAddress
export let currentPointer: WMAddress
export let currentFundType: FundType

export enum FundType {
  isSingle = 'single',
  isMultiple = 'multiple',
  isDefault = 'default',
  isFromTemplate = 'template',
  isUndefined = 'undefined',
}

export function fund(pointer?: WMAddress, options: fundOptions = {}): FundType | string {
  if (isBrowser(options)) {
    return clientSideFund(pointer, options)
  } else {
    if (pointer === undefined) {
      throw FundmeError(noUndefinedFundOnServerSide)
    } else {
      return serverSideFund(pointer)
    }
  }
}

let forceBrowser: boolean = false
export function forceFundmeOnBrowser() {
  forceBrowser = true
}

export const isBrowser = (options: fundOptions = {}): boolean => {
  if (forceBrowser || options.force === 'client') {
    forceBrowser = false
    return true
  }
  return require === undefined && module === undefined
}

export function setDefaultAddress(address: WMAddress): void {
  if (Array.isArray(address)) {
    defaultAddress = createPool(address)
  } else {
    defaultAddress = address
  }
}

export function setCurrentPointer(pointer: string | WMPointer[]) {
  currentPointer = pointer
}

export function setFundType(type: FundType): FundType {
  currentFundType = type

  return currentFundType
}

export function getCurrentPointerAddress(): string {
  // const forced = forceBrowser
  if (isBrowser()) {
    const metaTag: NodeListOf<HTMLMetaElement> = document.head.querySelectorAll('meta[name="monetization"]')

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
