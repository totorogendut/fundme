'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function FundmeError(err) {
    return 'Fundme.js: ' + err;
}
const addressNotFound = 'address not found.';
const addressIsNotAString = 'address must be a string.';
const getCurrentPointerAddressMustClientSide = "can't use getCurrentPointerAddress() server-side.";
function weightIsNotANumber(str) {
    return `${str} has weight that is not a number. It has been set to ${DEFAULT_WEIGHT} (default).`;
}
const invalidAddress = 'invalid Web Monetization pointer address is given.';
// default address
const defaultAddressNotFound = 'default address not found. Use setDefaultAddress(str: string) to set it first.';
const invalidDefaultAddress = 'invalid default address.';
const defaultAddressArrayCannotBeEmpty = 'invalid default address.';
// utils
const canOnlyCleanStringCustomSyntax = 'can only clean custom syntax with typeof string.';
// about meta tag for Web Monetization API
const metaTagNotFound = 'web monetization meta tag is not found.';
const metaTagMultipleIsFound = 'multiple <meta name="monetization" /> found - Web Monetization API only support a single meta tag.';
// pointers template
const noTemplateFound = 'no monetization template is found.';
const failParsingTemplate = 'fails to parse address from <template data-fund></template>.';
// script json template
const cannotParseScriptJson = 'cannot parse JSON from <script fundme>. Make sure it contains a valid JSON.';
const jsonTemplateIsInvalid = "found <script fundme> but it's not valid.";
const scriptFundmeIsNotApplicationJson = 'found <script fundme> but its type is not "application/json"';
/*****************************
 *                           *
 *  Server-side fund()       *
 *                           *
 *****************************/
const noUndefinedFundOnServerSide = "can't use fund() with empty parameters in server side.";
const invalidFundmeServerSide = 'invalid fundme parameters on the server-side.';

const DEFAULT_WEIGHT = 5;
// TODO check pointer.address with RegEx
function setPointerMultiple(pointers, options = {}) {
    const pool = createPool(pointers);
    const pickedPointer = pickPointer(pool);
    const pointerAddress = getPointerAddress(pickedPointer);
    setCurrentPointer(pool);
    if (isBrowser(options)) {
        return setWebMonetizationPointer(pointerAddress);
    }
    return pointerAddress;
}
function getPointerAddress(pointer) {
    const address = pointer.address;
    if (!address) {
        throw FundmeError(addressNotFound);
    }
    else if (typeof address !== 'string') {
        throw FundmeError(addressIsNotAString);
    }
    return address;
}
function createPool(pointers) {
    return pointers.map((pointer) => {
        let wmPointer;
        if (typeof pointer === 'string')
            pointer = convertToPointer(pointer);
        if (!hasAddress(pointer))
            throw FundmeError(addressNotFound);
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
    let address = str;
    let weight;
    const split = str.split('#');
    if (split.length > 1) {
        address = split[0];
        weight = parseInt(split[1], 10);
    }
    const pointer = {
        address,
        weight,
    };
    return checkWeight(pointer);
}

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
    const weights = pointers.map((pointer) => pointer.weight);
    return Object.values(weights).reduce((sum, weight) => sum + weight, 0);
}
function getWinningPointer(pointers, choice) {
    for (const pointer in pointers) {
        const weight = pointers[pointer].weight;
        if ((choice -= weight) <= 0) {
            return pointers[pointer];
        }
    }
}
function hasAddress(o) {
    if (!o)
        return false;
    return Object.keys(o).some((str) => str === 'address');
}
let defaultAddress;
function setDefaultAddress(address, options = {}) {
    if (Array.isArray(address)) {
        if (address.length) {
            defaultAddress = createPool(address);
            return;
        }
        else {
            throw FundmeError(defaultAddressArrayCannotBeEmpty);
        }
    }
    if (typeof address === 'string') {
        defaultAddress = address;
        return;
    }
    if (hasAddress(address)) {
        defaultAddress = getPointerAddress(address);
        return;
    }
    if (options.allowUndefined && address === undefined) {
        defaultAddress = undefined;
        return;
    }
    throw FundmeError(invalidDefaultAddress);
}
function getDefaultAddress() {
    return defaultAddress;
}
function defaultAddressMultiple(address) {
    return isMultiplePointer(address) ? address : [address];
}
let currentFundType;
function setFundType(type) {
    currentFundType = type;
    return currentFundType;
}
let currentPointer;
function setCurrentPointer(pointer) {
    currentPointer = pointer;
}
function getCurrentPointerAddress() {
    // const forced = forceBrowser
    if (isBrowser()) {
        const metaTag = document.head.querySelectorAll('meta[name="monetization"]');
        if (metaTag.length > 1) {
            throw FundmeError(metaTagMultipleIsFound);
        }
        if (metaTag[0]) {
            return metaTag[0].content;
        }
        throw FundmeError(metaTagNotFound);
    }
    else {
        if (currentPointer)
            return currentPointer.toString();
        throw FundmeError(getCurrentPointerAddressMustClientSide);
    }
}
function cleanSinglePointerSyntax(pointer) {
    if (typeof pointer === 'string') {
        pointer = pointer.split('#')[0];
    }
    else {
        throw FundmeError(canOnlyCleanStringCustomSyntax);
    }
    return pointer;
}
function getCurrentPointerPool() {
    let pointer = currentPointer;
    return convertToPointerPool(pointer);
}
function convertToPointerPool(pointer) {
    if (!Array.isArray(pointer)) {
        pointer = [pointer];
    }
    return pointer;
}

function setPointerSingle(pointer, options = {}) {
    pointer = cleanSinglePointerSyntax(pointer);
    setCurrentPointer(pointer);
    if (isBrowser(options)) {
        return setWebMonetizationPointer(pointer);
    }
    return pointer;
}

const FUNDME_TEMPLATE_SELECTOR = 'template[data-fund]';
const FUNDME_CUSTOM_SYNTAX_SELECTOR = 'template[fundme]';
const FUNDME_JSON_SELECTOR = 'script[fundme]';
function setPointerFromTemplates(options = {}) {
    const pointers = [
        ...scrapeTemplate(),
        ...scrapeJson(),
        ...scrapeCustomSyntax(),
    ];
    if (pointers.length) {
        setPointerMultiple(pointers, options);
    }
    else {
        throw FundmeError(noTemplateFound);
    }
}
// DON'T throw errors inside scrape functions if array is found to be empty
// fund() already do that
function scrapeJson() {
    const scriptTags = document.body.querySelectorAll(FUNDME_JSON_SELECTOR);
    let pointers = [];
    if (scriptTags.length) {
        scriptTags.forEach((json) => {
            pointers = parseScriptJson(json);
        });
    }
    return pointers;
}
function parseScriptJson(json) {
    let pointers = [];
    let parsed;
    try {
        parsed = JSON.parse(json.innerHTML);
    }
    catch (err) {
        throw FundmeError(cannotParseScriptJson);
    }
    if (json.type !== 'application/json') {
        throw FundmeError(scriptFundmeIsNotApplicationJson);
    }
    if (Array.isArray(parsed)) {
        pointers = createPool(parsed);
    }
    else if (typeof parsed === 'string') {
        pointers = createPool([parsed]);
    }
    else {
        throw FundmeError(jsonTemplateIsInvalid);
    }
    return pointers;
}
function scrapeTemplate() {
    const templates = document.body.querySelectorAll(FUNDME_TEMPLATE_SELECTOR);
    let pointers = [];
    if (templates.length) {
        templates.forEach((template) => {
            const pointer = parseTemplate(template);
            pointers = [...pointers, pointer];
        });
    }
    return pointers;
}
function parseTemplate(template) {
    let address = template.dataset.fund;
    let weight = template.dataset.fundWeight !== undefined
        ? parseInt(template.dataset.fundWeight, 0)
        : DEFAULT_WEIGHT;
    if (!address) {
        throw FundmeError(failParsingTemplate);
    }
    const pointer = checkWeight({
        address,
        weight,
    });
    return pointer;
}
function scrapeCustomSyntax() {
    const templates = document.querySelectorAll(FUNDME_CUSTOM_SYNTAX_SELECTOR);
    let pointers = [];
    if (templates.length) {
        templates.forEach((template) => {
            pointers = [...pointers, ...parseCustomSyntax(template)];
        });
    }
    return pointers;
}
function parseCustomSyntax(template) {
    let pointers = [];
    const temp = template.innerHTML;
    temp.split(';').forEach((str) => {
        const strippedString = str.replace(/(^\s+|\s+$)/g, '');
        if (strippedString) {
            pointers = [...pointers, convertToPointer(strippedString)];
        }
    });
    return pointers;
}

function clientSideFund(pointer, options = {}) {
    if (typeof pointer === 'string') {
        if (pointer === 'default') {
            if (getDefaultAddress() !== undefined) {
                if (typeof getDefaultAddress() === 'string') {
                    setPointerSingle(getDefaultAddress().toString(), options);
                }
                else {
                    setPointerMultiple(defaultAddressMultiple(getDefaultAddress()), options);
                }
                return setFundType(FundType.isDefault);
            }
            else {
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
    if (pointer === undefined) {
        setPointerFromTemplates();
        return setFundType(FundType.isFromTemplate);
    }
    throw FundmeError(invalidAddress);
}
let forceBrowser = false;
const isNodeEnv = require !== undefined && module !== undefined;
const isBrowser = (options = {}) => {
    if (options.force === 'server')
        return false;
    const forced = forceBrowser;
    forceBrowser = false;
    return !isNodeEnv || forced || options.force === 'client';
};

function serverSideFund(pointer) {
    if (typeof pointer === 'string') {
        return setPointerSingle(pointer).toString();
    }
    if (isMultiplePointer(pointer)) {
        return setPointerMultiple(pointer).toString();
    }
    throw FundmeError(invalidFundmeServerSide);
}

var FundType;
(function (FundType) {
    FundType["isSingle"] = "single";
    FundType["isMultiple"] = "multiple";
    FundType["isDefault"] = "default";
    FundType["isFromTemplate"] = "template";
    FundType["isUndefined"] = "undefined";
})(FundType || (FundType = {}));
function fund(pointer, options = {}) {
    if (isBrowser(options)) {
        return clientSideFund(pointer, options);
    }
    else {
        if (pointer === undefined) {
            throw FundmeError(noUndefinedFundOnServerSide);
        }
        else {
            return serverSideFund(pointer);
        }
    }
}

exports.fund = fund;
exports.getCurrentPointerAddress = getCurrentPointerAddress;
exports.getCurrentPointerPool = getCurrentPointerPool;
exports.setDefaultAddress = setDefaultAddress;
