import { clientSideFund, isBrowser } from './fund-browser'
import { serverSideFund } from './fund-server'
import { noUndefinedFundOnServerSide, FundmeError } from './errors'

export function fund(pointer?: WMAddress, options: fundOptions = {}): FundType | string {
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
