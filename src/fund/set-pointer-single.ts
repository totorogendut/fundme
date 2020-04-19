import { setCurrentPointer, setWebMonetizationPointer } from './utils'
import { isBrowser } from './fund-browser'

export function setPointerSingle(pointer: string, options: fundOptions = {}): void {
  setCurrentPointer(pointer)
  if (isBrowser(options)) {
    setWebMonetizationPointer(pointer)
  }
}
