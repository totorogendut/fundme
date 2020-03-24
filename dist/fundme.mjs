function isMultiplePointer(s) {
    return Array.isArray(s);
}
function setWebMonetizationPointer(address) {
    let wmAddress = document.querySelector('meta[name="monetization"]');
    return setWebMonetizationTag(wmAddress, address);
}
function setWebMonetizationTag(wmAddress, address) {
    if (!wmAddress) {
        wmAddress = createWebMonetizationTag(address);
    }
    else {
        wmAddress.content = address;
    }
    return wmAddress;
}
function createWebMonetizationTag(address) {
    const wmAddress = document.createElement('meta');
    wmAddress.name = 'monetization';
    wmAddress.content = address;
    document.head.appendChild(wmAddress);
    return wmAddress;
}
function getPoolWeightSum(pointers) {
    const weights = pointers.map(pointer => pointer.weight);
    return Object.values(weights)
        .reduce((sum, weight) => sum + weight, 0);
}
function getWinningPointer(pointers, choice) {
    for (const pointer in pointers) {
        const weight = pointers[pointer].weight;
        if ((choice -= weight) <= 0) {
            return pointers[pointer];
        }
    }
}

function setPointerSingle(pointer) {
    setWebMonetizationPointer(pointer);
}

const defaultAddressNotFound = 'Fundme.js: default address not found. Use setDefaultAddress(str: string) to set it first.';
const invalidAddress = 'Fundme.js: Invalid Web Monetization pointer address is given.';
const addressNotFound = "Fundme.js: address not found.";
const addressIsNotAString = "Fundme.js: address must be a string.";
function weightIsNotANumber(str) {
    return `Fundme.js: ${str} has weight that is not a number. It has been set to ${DEFAULT_WEIGHT} (default).`;
}

const DEFAULT_WEIGHT = 5;
// TODO check pointer.address with RegEx
function setPointerMultiple(pointers, maxPool) {
    const pool = createPool(pointers);
    const pickedPointer = pickPointer(pool);
    setWebMonetizationPointer(getPointerAddress(pickedPointer));
}
function getPointerAddress(pointer) {
    const address = pointer.address;
    if (!address) {
        throw new Error(addressNotFound);
    }
    else if (typeof address !== 'string') {
        throw new Error(addressIsNotAString);
    }
    return address;
}
function createPool(pointers) {
    return pointers.map(pointer => {
        let wmPointer;
        if (typeof pointer === "string")
            pointer = convertToPointer(pointer);
        if (!('address' in pointer))
            throw new Error(addressNotFound);
        wmPointer = checkWeight(pointer);
        return wmPointer;
    });
}
function checkWeight(pointer) {
    if (pointer.weight === undefined || pointer.weight === NaN) {
        console.warn(weightIsNotANumber(pointer.address));
        pointer.weight = DEFAULT_WEIGHT;
    }
    return pointer;
}
// TODO getting pointer from pool
function pickPointer(pointers) {
    const sum = getPoolWeightSum(pointers);
    let choice = getChoice(sum);
    return getWinningPointer(pointers, choice);
}
function getChoice(sum) {
    const choice = Math.random() * sum;
    return choice;
}
function convertToPointer(str) {
    const pointer = {
        address: str,
        weight: DEFAULT_WEIGHT
    };
    return pointer;
}

let defaultAddress;
var FundType;
(function (FundType) {
    FundType["isSingle"] = "single";
    FundType["isMultiple"] = "multiple";
    FundType["isDefault"] = "default";
    FundType["isFromTemplate"] = "template";
    FundType["isUndefined"] = "undefined";
})(FundType || (FundType = {}));
function fund(pointer, options) {
    // const setDefault = options && options.default
    if (typeof pointer === "string") {
        if (pointer === 'default') {
            if (defaultAddress !== undefined) {
                if (typeof defaultAddress === 'string') {
                    setPointerSingle(defaultAddress);
                }
                else {
                    setPointerMultiple(defaultAddress);
                }
                return FundType.isDefault;
            }
            else {
                throw new Error(defaultAddressNotFound);
            }
        }
        setPointerSingle(pointer);
        return FundType.isSingle;
    }
    if (isMultiplePointer(pointer)) {
        setPointerMultiple(pointer);
        return FundType.isMultiple;
    }
    if (pointer === undefined) {
        return FundType.isFromTemplate;
    }
    throw new Error(invalidAddress);
}
function setDefaultAddress(address) {
    defaultAddress = address;
}

export { fund, setDefaultAddress };
