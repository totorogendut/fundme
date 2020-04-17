import { isMultiplePointer } from './utils'
import { setPointerSingle } from './set-pointer-single'
import { setPointerFromTemplates } from './set-pointer-template'
import { setPointerMultiple } from './set-pointer-multiple'
import { defaultAddressNotFound, invalidAddress, FundmeError } from './errors'
import { defaultAddress, FundType, setFundType } from './main'

export function clientSideFund(pointer?: WMAddress, options: fundOptions = {}): FundType {
  if (typeof pointer === 'string') {
    if (pointer === 'default') {
      if (defaultAddress !== undefined) {
        if (typeof defaultAddress === 'string') {
          setPointerSingle(defaultAddress, options)
        } else {
          setPointerMultiple(defaultAddress, options)
        }
        return setFundType(FundType.isDefault)
      } else {
        throw FundmeError(defaultAddressNotFound)
      }
    }
    setPointerSingle(pointer, options)
    return setFundType(FundType.isSingle)
  }

  if (isMultiplePointer(pointer)) {
    setPointerMultiple(pointer, options)
    return setFundType(FundType.isMultiple)
  }

  if (pointer === undefined) {
    setPointerFromTemplates()
    return setFundType(FundType.isFromTemplate)
  }
  throw FundmeError(invalidAddress)
}
