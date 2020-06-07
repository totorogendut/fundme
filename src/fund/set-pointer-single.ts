import { setCurrentPointer, setWebMonetizationPointer, cleanSinglePointerSyntax } from "./utils";
import { isBrowser } from "./fund-browser";

export function setPointerSingle(pointer: string, options: fundOptions = {}): returnValidPointer {
  pointer = cleanSinglePointerSyntax(pointer);
  setCurrentPointer(pointer);

  if (isBrowser(options)) {
    return setWebMonetizationPointer(pointer);
  }

  return pointer;
}
