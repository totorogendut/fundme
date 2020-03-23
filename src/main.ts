import { isMultiplePointer } from './utils'
import { setPointerSingle } from './set-pointer-single'
import { setPointerMultiple } from './set-pointer-multiple'

export let defaultAddress: WMAddress;

export enum FundType {
  isSingle = 'single',
  isMultiple = 'multiple',
  isDefault = 'default',
  isUndefined = 'undefined'
}

export default function fund(pointer?: WMAddress, options?: fundOptions): FundType {
  const setDefault = options && options.default
  if (typeof pointer === "string") {
    if (setDefault) {
      setDefaultAddress(pointer)
    }
    setPointerSingle(pointer);
    return FundType.isSingle
  } else {
    if (setDefault) {
      throw new Error("Fundme.js: default pointer can only accept a single string. Please remove option default if you wish to continue.")
    }
  }

  if (isMultiplePointer(pointer)) {
    setPointerMultiple(pointer);
    return FundType.isMultiple
  } else if (pointer === undefined) {
    if (defaultAddress !== undefined) {
      setPointerSingle(defaultAddress.toString())
      return FundType.isDefault
    } else {
      throw new Error("Fundme.js: Web Monetization is not set, default pointer as a fallback is not found.")
    }
  } else {
    throw new Error("Fundme.js: Invalid Web Monetization API address given.");
  }
}

export function setDefaultAddress(str: string): void {
  defaultAddress = str
}
