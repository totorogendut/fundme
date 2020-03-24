import { isMultiplePointer } from './utils'
import { setPointerSingle } from './set-pointer-single'
import { setPointerMultiple } from './set-pointer-multiple'
import { setPointerFromTemplates } from './set-pointer-template'

export let defaultAddress: WMAddress;

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
        throw new Error(errors.defaultAddressNotFound)
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
  throw new Error(errors.invalidAddress);
}

export function setDefaultAddress(address: WMAddress): void {
  defaultAddress = address
}

export const errors = {
  defaultAddressNotFound: 'Fundme.js: default address not found. Use setDefaultAddress(str: string) to set it first.',
  invalidAddress: 'Fundme.js: Invalid Web Monetization pointer address is given.'
}