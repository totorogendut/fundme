import { setCurrentPointer } from './main'
import { isMultiplePointer } from './utils'
import { setPointerMultiple } from './set-pointer-multiple'
import { FundmeError, invalidFundmeServerSide } from './errors'

export function serverSideFund(pointer: WMAddress): string {
  if (typeof pointer === 'string') {
    setCurrentPointer(pointer)
    return pointer
  }

  if (isMultiplePointer(pointer)) {
    return setPointerMultiple(pointer)
  }

  throw FundmeError(invalidFundmeServerSide)
}
