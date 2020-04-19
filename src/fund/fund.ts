import { clientSideFund, isBrowser } from './fund-browser'
import { serverSideFund } from './fund-server'
import { noUndefinedFundOnServerSide, FundmeError } from './errors'
import { cleanSinglePointerSyntax } from './utils'

export enum FundType {
  isSingle = 'single',
  isMultiple = 'multiple',
  isDefault = 'default',
  isFromTemplate = 'template',
  isUndefined = 'undefined',
}

export function fund(pointer?: WMAddress, options: fundOptions = {}): FundType | string {
  pointer = cleanSinglePointerSyntax(pointer)
  if (isBrowser(options)) {
    return clientSideFund(pointer, options)
  } else {
    if (pointer === undefined) {
      throw FundmeError(noUndefinedFundOnServerSide)
    } else {
      return serverSideFund(pointer)
    }
  }
}
