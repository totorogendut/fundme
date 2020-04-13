import { setWebMonetizationPointer } from './utils'
import { setCurrentPointer, isBrowser } from './main'

export function setPointerSingle(pointer: string): void {
  setCurrentPointer(pointer)
  if (isBrowser()) {
    setWebMonetizationPointer(pointer)
  }
}
