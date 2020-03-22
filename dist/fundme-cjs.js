'use strict';

const DEFAULT_CHANCE = 5;
// TODO check pointer.address with RegEx
function setPointerMultiple(pointers, maxPool) {
    const pool = pointers.map(pointer => {
        let wmPointer;
        if (typeof pointer === "string")
            pointer = convertToPointer(pointer);
        if (!('address' in pointer))
            throw new Error(errors.addressNotFound);
        wmPointer = stabilizeChance(pointer);
        return wmPointer;
    });
    const selectedPointer = pickPointer(pool).address;
    setWebMonetizationPointer(selectedPointer);
}
function convertToPointer(s) {
    const pointer = {
        address: s,
        chance: DEFAULT_CHANCE
    };
    return pointer;
}
const errors = {
    addressNotFound: "Fundme.js: address not found not found.",
    chanceNotFound: "Fundme.js: entries .chance not found.",
};

function isArray(s) {
    return Array.isArray(s);
}
function setWebMonetizationPointer(address) {
    let wmAddress = document.querySelector('meta[name="monetization"]');
    if (!wmAddress) {
        wmAddress = document.createElement('meta');
        wmAddress.name = 'monetization';
        wmAddress.content = address;
        document.head.appendChild(wmAddress);
    }
    else {
        wmAddress.content = address;
    }
    return wmAddress;
}
function stabilizeChance(pointer) {
    if (pointer.chance === undefined || pointer.chance === NaN) {
        console.warn(`Fundme.js: ${pointer.address} has chance that is not a number. It has been set to 5 (default).`);
        pointer.chance = DEFAULT_CHANCE;
    }
    return pointer;
}
// TODO getting pointer from pool
function pickPointer(pointers) {
    const chances = pointers.map(pointer => pointer.chance);
    const sum = Object.values(chances).reduce((sum, weight) => sum + weight, 0);
    let choice = Math.random() * sum;
    for (const pointer in pointers) {
        const weight = pointers[pointer].chance;
        if ((choice -= weight) <= 0) {
            return pointers[pointer];
        }
    }
}

function setPointerSingle(pointer) {
    setWebMonetizationPointer(pointer);
}

let defaultAddress;
function fund(pointer, options) {
    if (options.setDefault)
        defaultAddress = pointer;
    if (typeof pointer === "string") {
        setPointerSingle(pointer);
    }
    else if (isArray(pointer)) {
        setPointerMultiple(pointer);
    }
    else if (pointer === undefined) {
        if (defaultAddress !== undefined) {
            fund(defaultAddress);
        }
        else {
            throw new Error("Fundme.js: Web Monetization is not set, default default pointer as a fallback is not found.");
        }
    }
    else {
        throw new Error("Fundme.js: Invalid Web Monetization API address given.");
    }
}

module.exports = fund;
