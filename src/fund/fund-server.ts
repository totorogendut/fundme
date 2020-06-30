import { isMultiplePointer } from "./utils";
import { setPointerMultiple } from "./set-pointer-multiple";
import { FundmeError, invalidFundmeServerSide, noUndefinedFundOnServerSide } from "./errors";
import { setPointerSingle } from "./set-pointer-single";

export function serverSideFund(pointer: WMAddress): string {
  if (pointer === undefined) throw FundmeError(noUndefinedFundOnServerSide);

  if (typeof pointer === "string") {
    return setPointerSingle(pointer).toString();
  }

  if (isMultiplePointer(pointer)) {
    return setPointerMultiple(pointer).toString();
  }

  throw FundmeError(invalidFundmeServerSide);
}
