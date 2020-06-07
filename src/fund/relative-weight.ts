const relativeWeightMap = new Map();
let index = 0;

export function calculateRelativeWeight(weight: string, pool: WMPointer[]): number {
  return 0; // TODO - add % unit to calculate weight
}

export function registerRelativeWeight(weight: string) {
  relativeWeightMap.set(++index, weight);
  console.log("Registering a relative weight with", weight, "at index", index);
  console.log(relativeWeightMap);
}
