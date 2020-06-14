import { getPoolWeightSum, isNumberOnly } from "./utils";
import { createPool } from "./set-pointer-multiple";
import {
  FundmeError,
  relativeWeightMustEndsWithPercentage,
  paymentPointersMustHaveAtLeastOneFixedPointer,
  invalidWeight,
  invalidRelativeWeight,
  relativeWeightChanceError,
  weightForRelativePointerNotFound,
} from "./errors";

let relativeWeightPointers: WMPointer[] = [];
let fixedWeightPointers: WMPointer[] = [];
let totalRelativeChance = 0;
let pointerPoolSum = 0;

function clear() {
  relativeWeightPointers = [];
  fixedWeightPointers = [];
  totalRelativeChance = 0;
}

export function calculateRelativeWeight(pool: WMPointer[]): WMPointer[] {
  clear();
  pointerPoolSum = getPoolWeightSum(pool);
  let relativeWeightPointers;

  try {
    relativeWeightPointers = pool.filter(filterRelativeWeight);
  } catch (err) {
    throw err;
  }

  if (!fixedWeightPointers.length) throw FundmeError(paymentPointersMustHaveAtLeastOneFixedPointer);

  const newFixedPointers = normalizeFixedPointers(fixedWeightPointers, totalRelativeChance);
  const newRelativePointers = normalizeRelativePointers(relativeWeightPointers, pointerPoolSum);

  return [...newFixedPointers, ...newRelativePointers];
}

function filterRelativeWeight(pointer: WMPointer) {
  let weight = pointer.weight!;
  if (typeof weight === "string" && weight.endsWith("%")) {
    const convertedWeight = weight.slice(0, -1);
    if (!isNumberOnly(convertedWeight)) {
      throw FundmeError(invalidRelativeWeight(pointer.address));
    }

    registerRelativeWeight(pointer);
    return true;
  } else {
    if (typeof JSON.parse(weight as string) !== "number") {
      throw FundmeError(invalidWeight(pointer.address));
    }

    registerFixedWeight(pointer);
    return false;
  }
}

export function registerRelativeWeight(pointer: WMPointer) {
  pointer.weight = getWeight(pointer);
  relativeWeightPointers.push(pointer);
}

export function registerFixedWeight(pointer: WMPointer) {
  fixedWeightPointers.push(pointer);
}

function normalizeFixedPointers(pool: WMPointer[], chance: number): WMPointer[] {
  if (chance > 1 || chance === NaN) throw FundmeError(relativeWeightChanceError);
  chance = 1 - chance;

  return pool.map((pointer) => {
    let weight: number;
    if (typeof pointer.weight! === "string") {
      weight = parseFloat(pointer.weight!);
    } else {
      weight = pointer.weight!;
    }

    pointer.weight! = weight * chance;

    return pointer;
  });
}

function normalizeRelativePointers(pool: WMPointer[], sum: number): WMPointer[] {
  return pool.map((pointer) => {
    return pointer;
  });
}

function getWeight(pointer: string | WMPointer): number {
  let chance;

  if (typeof pointer === "string") {
    if (pointer.endsWith("%")) {
      const weight = pointer.split("#")[1];
      chance = parseFloat(weight) / 100;
    } else {
      throw FundmeError(relativeWeightMustEndsWithPercentage);
    }
  } else {
    if (!pointer.weight) {
      throw FundmeError(weightForRelativePointerNotFound(pointer.address || pointer));
    }
    if (typeof pointer.weight === "string") pointer.weight = parseFloat(pointer.weight);
    chance = pointer.weight / 100;
  }

  totalRelativeChance += chance;

  return pointerPoolSum * chance; // TODO - add % unit to calculate weight
}
