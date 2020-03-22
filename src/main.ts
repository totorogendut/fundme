import { isMultiplePointer } from './utils'
import { setPointerSingle } from './set-pointer-single'
import { setPointerMultiple } from './set-pointer-multiple'

let defaultAddress: WMAddress;

export default function fund(pointer: WMAddress, options?: fundOptions): void {
  if (options.setDefault) defaultAddress = pointer;

  if (typeof pointer === "string") {
    setPointerSingle(pointer);
  } else if (isMultiplePointer(pointer)) {
    setPointerMultiple(pointer);
  } else if (pointer === undefined) {
    if (defaultAddress !== undefined) {
      fund(defaultAddress);
    } else {
      throw new Error("Fundme.js: Web Monetization is not set, default default pointer as a fallback is not found.")
    }
  } else {
    throw new Error("Fundme.js: Invalid Web Monetization API address given.");
  }
}

