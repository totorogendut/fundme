import { isMultiplePointer } from './utils'
import { setPointerSingle } from './set-pointer-single'
import { setPointerMultiple } from './set-pointer-multiple'
import { setPointerFromTemplates } from './set-pointer-template'
import { defaultAddressNotFound, invalidAddress, metaTagNotFound, metaTagMultipleIsFound } from './errors'

export let defaultAddress: WMAddress;
export let currentPointer: WMAddress;

export enum FundType {
  isSingle = 'single',
  isMultiple = 'multiple',
  isDefault = 'default',
  isFromTemplate = 'template',
  isUndefined = 'undefined'
}

export function fund(pointer?: WMAddress, options?: fundOptions): FundType {
  // const setDefault = options && options.default
  if (typeof pointer === "string") {
    if (pointer === 'default') {
      if (defaultAddress !== undefined) {
        if (typeof defaultAddress === 'string') {
          setPointerSingle(defaultAddress);
        } else {
          setPointerMultiple(defaultAddress);
        }
        return FundType.isDefault
      } else {
        throw new Error(defaultAddressNotFound)
      }
    }
    setPointerSingle(pointer);
    return FundType.isSingle
  }

  if (isMultiplePointer(pointer)) {
    setPointerMultiple(pointer);
    return FundType.isMultiple
  }

  if (pointer === undefined) {
    setPointerFromTemplates()
    return FundType.isFromTemplate
  }
  throw new Error(invalidAddress);
}

export function setDefaultAddress(address: WMAddress): void {
  defaultAddress = address
}

export function setCurrentPointer(pointer: string | WMPointer[]) {
  currentPointer = pointer
}

export function getCurrentPointerAddress(): string {
  const metaTag: NodeListOf<HTMLMetaElement> =
    document.head.querySelectorAll('meta[name="monetization"]')

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

  if (!Array.isArray(pointer)) {
    pointer = [pointer]
  }

  return pointer
}