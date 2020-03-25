import { setWebMonetizationPointer } from './utils'
import { setCurrentPointer } from './main'

export function setPointerSingle(pointer: string): void {
  setCurrentPointer(pointer)
  setWebMonetizationPointer(pointer)
}
