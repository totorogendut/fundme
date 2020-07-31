import { FundmeError, splitFundError } from "./errors";
import { getCurrentPointerPool, getPoolWeightSum } from "./utils";
import { calculateRelativeWeight } from "./relative-weight";
import { createPool } from "./set-pointer-multiple";

interface splittedFund {
  address: string;
  amount: number;
  weight: string | number;
}

export function splitFund(amount: number): splittedFund[] {
  let pool: WMPointer[] = createPool(getCurrentPointerPool());
  let sum = 0;
  if (!pool.length) {
    throw FundmeError(splitFundError);
  } else {
    // process pointer pool
    pool = calculateRelativeWeight(pool);
    sum = getPoolWeightSum(pool);
  }

  return pool.map((pointer: WMPointer) => {
    const fraction = (pointer.weight as number) / sum;
    return {
      address: pointer.address,
      amount: amount * fraction,
      weight: pointer.weight!,
    };
  });
}
