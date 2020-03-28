import { isMultiplePointer } from './utils'
import { setPointerSingle } from './set-pointer-single'
import { setPointerMultiple, createPool } from './set-pointer-multiple'
import { setPointerFromTemplates } from './set-pointer-template'
import { defaultAddressNotFound, invalidAddress, metaTagNotFound, metaTagMultipleIsFound } from './errors'

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

export function fund(pointer?: WMAddress, options?: fundOptions): FundType {
  if (typeof pointer === 'string') {
    if (pointer === 'default') {
      if (defaultAddress !== undefined) {
        if (typeof defaultAddress === 'string') {
          setPointerSingle(defaultAddress)
        } else {
          setPointerMultiple(defaultAddress)
        }
        return setFundType(FundType.isDefault)
      } else {
        throw new Error(defaultAddressNotFound)
      }
    }
    setPointerSingle(pointer)
    return setFundType(FundType.isSingle)
  }

  if (isMultiplePointer(pointer)) {
    setPointerMultiple(pointer)
    return setFundType(FundType.isMultiple)
  }

  if (pointer === undefined) {
    setPointerFromTemplates()
    return setFundType(FundType.isFromTemplate)
  }
  throw new Error(invalidAddress)
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
  const metaTag: NodeListOf<HTMLMetaElement> = document.head.querySelectorAll('meta[name="monetization"]')

  if (metaTag.length > 1) {
    throw new Error(metaTagMultipleIsFound)
  }

  if (metaTag[0]) {
    return metaTag[0].content
  }

  throw new Error(metaTagNotFound)
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
