import { isMultiplePointer, setFundType, getDefaultAddress, defaultAddressMultiple } from "./utils";
import { setPointerSingle } from "./set-pointer-single";
import { setPointerFromTemplates } from "./set-pointer-template";
import { setPointerMultiple } from "./set-pointer-multiple";
import { defaultAddressNotFound, invalidAddress, FundmeError } from "./errors";
import { FundType } from "./fund";
import { isNode } from "browser-or-node";

export function clientSideFund(pointer?: WMAddress, options: fundOptions = {}): FundType {
  if (pointer === undefined) {
    setPointerFromTemplates();
    return setFundType(FundType.isFromTemplate);
  }

  if (typeof pointer === "string") {
    if (pointer === "default") {
      if (getDefaultAddress() !== undefined) {
        if (typeof getDefaultAddress() === "string") {
          setPointerSingle(getDefaultAddress().toString(), options);
        } else {
          setPointerMultiple(defaultAddressMultiple(getDefaultAddress()), options);
        }
        return setFundType(FundType.isDefault);
      } else {
        throw FundmeError(defaultAddressNotFound);
      }
    }
    setPointerSingle(pointer, options);
    return setFundType(FundType.isSingle);
  }

  if (isMultiplePointer(pointer)) {
    setPointerMultiple(pointer, options);
    return setFundType(FundType.isMultiple);
  }

  throw FundmeError(invalidAddress);
}

let forceBrowser: boolean = false;
export function forceFundmeOnBrowser() {
  forceBrowser = true;
}

export const isBrowser = (options: fundOptions = {}): boolean => {
  if (options.force === "server") return false;
  const forced = forceBrowser;
  forceBrowser = false;

  return !isNode || forced || options.force === "client";
};
