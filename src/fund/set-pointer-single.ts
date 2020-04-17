import { setWebMonetizationPointer } from './utils'
import { setCurrentPointer, isBrowser } from './main'

export function setPointerSingle(pointer: string, options: fundOptions = {}): void {
  setCurrentPointer(pointer)
  if (isBrowser(options)) {
    setWebMonetizationPointer(pointer)
  }
}
