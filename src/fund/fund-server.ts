import { isMultiplePointer, setCurrentPointer } from "./utils";
import { setPointerMultiple } from "./set-pointer-multiple";
import { FundmeError, invalidFundmeServerSide } from "./errors";
import { setPointerSingle } from "./set-pointer-single";

export function serverSideFund(pointer: WMAddress): string {
  if (pointer === undefined) throw FundmeError(invalidFundmeServerSide);

  if (typeof pointer === "string") {
    return setPointerSingle(pointer).toString();
  }

  if (isMultiplePointer(pointer)) {
    return setPointerMultiple(pointer).toString();
  }

  throw FundmeError(invalidFundmeServerSide);
}
