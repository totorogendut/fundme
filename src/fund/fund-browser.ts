import { isMultiplePointer, setFundType, getDefaultAddress } from './utils'
import { setPointerSingle } from './set-pointer-single'
import { setPointerFromTemplates } from './set-pointer-template'
import { setPointerMultiple } from './set-pointer-multiple'
import { defaultAddressNotFound, invalidAddress, FundmeError } from './errors'

enum FundType {
  isSingle = 'single',
  isMultiple = 'multiple',
  isDefault = 'default',
  isFromTemplate = 'template',
  isUndefined = 'undefined',
}

export function clientSideFund(pointer?: WMAddress, options: fundOptions = {}): FundType {
  if (typeof pointer === 'string') {
    if (pointer === 'default') {
      if (getDefaultAddress() !== undefined) {
        if (typeof getDefaultAddress() === 'string') {
          setPointerSingle(getDefaultAddress().toString(), options)
        } else {
          setPointerMultiple([...getDefaultAddress()], options)
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

let forceBrowser: boolean = false
export function forceFundmeOnBrowser() {
  forceBrowser = true
}

export const isBrowser = (options: fundOptions = {}): boolean => {
  if (options.force === 'server') return false

  if (forceBrowser || options.force === 'client') {
    forceBrowser = false
    return true
  }

  return require === undefined && module === undefined
}
