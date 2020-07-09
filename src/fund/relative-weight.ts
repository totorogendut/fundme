import { getPoolWeightSum, isNumberOnly } from "./utils";
import {
  FundmeError,
  relativeWeightMustEndsWithPercentage,
  paymentPointersMustHaveAtLeastOneFixedPointer,
  invalidWeight,
  invalidRelativeWeight,
  relativeWeightChanceError,
  weightForRelativePointerNotFound,
} from "./errors";
import { DEFAULT_WEIGHT } from "./set-pointer-multiple";

let relativeWeightPointers: Array<WMPointer> = [];
let fixedWeightPointers: Array<WMPointer> = [];
let totalRelativeChance = 0;
let pointerPoolSum = 0;

export function clear() {
  relativeWeightPointers = [];
  fixedWeightPointers = [];
  totalRelativeChance = 0;
  pointerPoolSum = 0;

  return {
    relativeWeightPointers,
    fixedWeightPointers,
    totalRelativeChance,
    pointerPoolSum,
  };
}

export function calculateRelativeWeight(pool: WMPointer[]): WMPointer[] {
  clear();
  pointerPoolSum = getPoolWeightSum(pool);
  let relativeWeightPointers;

  relativeWeightPointers = pool.filter(filterRelativeWeight);
  // console.log(relativeWeightPointers);
  if (!fixedWeightPointers.length) throw FundmeError(paymentPointersMustHaveAtLeastOneFixedPointer);

  return [
    ...normalizeFixedPointers(fixedWeightPointers, totalRelativeChance),
    ...normalizeRelativePointers(relativeWeightPointers, pointerPoolSum),
  ];
}

export function filterRelativeWeight(pointer: WMPointer): boolean {
  if (pointer.weight === undefined) return false;

  let weight = pointer.weight;

  if (typeof weight === "string" && weight.endsWith("%")) {
    const convertedWeight = weight.slice(0, -1);
    if (!isNumberOnly(convertedWeight)) {
      throw FundmeError(invalidRelativeWeight(pointer.address));
    }
    registerRelativeWeight(pointer);
    return true;
  }

  if (isNumberOnly(weight)) {
    registerFixedWeight(pointer);
    return false;
  }

  throw FundmeError(invalidWeight(pointer.address, weight));
}

export function registerRelativeWeight(pointer: WMPointer) {
  pointer.weight = getRelativeWeight(pointer);
  relativeWeightPointers.push(pointer);
}

export function registerFixedWeight(pointer: WMPointer) {
  if (typeof pointer.weight === "string") {
    pointer.weight = parseFloat(pointer.weight!);
  }

  fixedWeightPointers.push(pointer);
}

export function normalizeFixedPointers(pool: WMPointer[], chance: number): WMPointer[] {
  if (chance > 1 || chance === NaN) throw FundmeError(relativeWeightChanceError);
  chance = 1 - chance;
  // decrease all fixed pointer weights
  // based on total relative chance registered

  return pool.map((pointer) => {
    let weight: number;
    if (typeof pointer.weight === "string") {
      weight = parseFloat(pointer.weight!);
    } else {
      weight = pointer.weight ?? DEFAULT_WEIGHT;
    }

    pointer.weight = weight * chance;

    return pointer;
  });
}

export function normalizeRelativePointers(pool: WMPointer[], sum: number): WMPointer[] {
  return pool.map((pointer) => {
    return pointer;
  });
}

export function getRelativeWeight(pointer: string | WMPointer): number {
  let chance;

  if (typeof pointer === "string") {
    const weight = pointer.split("#")[1];
    if (pointer.endsWith("%")) {
      chance = parseFloat(weight) / 100;
    } else {
      throw FundmeError(relativeWeightMustEndsWithPercentage);
    }
  } else {
    if (!pointer.weight) {
      throw FundmeError(weightForRelativePointerNotFound(pointer.address));
    }

    if (typeof pointer.weight === "string") {
      if (!pointer.weight.endsWith("%")) throw FundmeError(relativeWeightMustEndsWithPercentage);
      pointer.weight = parseFloat(pointer.weight);
    } else {
      throw FundmeError(invalidRelativeWeight(pointer.address));
    }

    chance = pointer.weight / 100;
  }

  totalRelativeChance += chance;

  return pointerPoolSum * chance; // TODO - add % unit to calculate weight
}

// Jest related functions
export function mockVariables() {
  relativeWeightPointers = [{ address: "test", weight: 1 }];
  fixedWeightPointers = [{ address: "test", weight: 1 }];
  totalRelativeChance = 44;
  pointerPoolSum = 55;

  return {
    relativeWeightPointers,
    fixedWeightPointers,
    totalRelativeChance,
    pointerPoolSum,
  };
}
