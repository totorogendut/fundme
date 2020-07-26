define(['exports', 'util'], function (exports, util) { 'use strict';

  function FundmeError(err) {
      return 'Fundme.js: ' + err;
  }
  const addressNotFound = 'address not found.';
  const addressIsNotAString = 'address must be a string.';
  const getCurrentPointerAddressMustClientSide = "can't use getCurrentPointerAddress() server-side.";
  const invalidAddress = 'invalid Web Monetization pointer address is given.';
  // multiple pointers
  const getWinningPointerMustBeANumber = "all pointers' weight during calculating a winning pointer must have type of number.";
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
  // relative weight
  const paymentPointersMustHaveAtLeastOneFixedPointer = 'revenue sharing payment pointers must have at least one payment address pointer with fixed weight.';
  const relativeWeightChanceError = "error when calculating total relative weight chance. Make sure it's a float between 0~1.0.";
  const weightForRelativePointerNotFound = (address)=>{
      return `payment pointer weights not found for ${address}`;
  };
  const relativeWeightMustEndsWithPercentage = 'relative weights must end with character %.';
  const invalidRelativeWeight = (address)=>{
      return `relative weight for payment pointer ${address} must be integer or float.`;
  };
  const invalidWeight = (address, weight)=>{
      return `weight for payment pointer ${address}#${weight} is invalid.`;
  };
  /*****************************
   *                           *
   *  Server-side fund()       *
   *                           *
   *****************************/
  const noUndefinedFundOnServerSide = "can't use fund() with empty parameters in server side.";
  const invalidFundmeServerSide = 'invalid fundme on the server-side.';

<<<<<<< HEAD
  let relativeWeightPointers = [];
  let fixedWeightPointers = [];
  let totalRelativeChance = 0;
  let pointerPoolSum = 0;
=======
  var noUndefinedFundOnServerSide = "can't use fund() with empty parameters in server side.";
  var invalidFundmeServerSide = "invalid fundme parameters on the server-side.";

  var relativeWeightPointers = [];
  var fixedWeightPointers = [];
  var totalRelativeChance = 0;
  var pointerPoolSum = 0;
>>>>>>> parent of fd157ad... migrate babel -> swc
  function clear() {
      relativeWeightPointers = [];
      fixedWeightPointers = [];
      totalRelativeChance = 0;
      pointerPoolSum = 0;
      return {
          relativeWeightPointers,
          fixedWeightPointers,
          totalRelativeChance,
          pointerPoolSum
      };
  }
  function calculateRelativeWeight(pool) {
<<<<<<< HEAD
      clear();
      pointerPoolSum = getPoolWeightSum(pool);
      let relativeWeightPointers1;
      relativeWeightPointers1 = pool.filter(filterRelativeWeight);
      // console.log(relativeWeightPointers);
      if (!fixedWeightPointers.length) throw FundmeError(paymentPointersMustHaveAtLeastOneFixedPointer);
      return [
          ...normalizeFixedPointers(fixedWeightPointers, totalRelativeChance),
          ...normalizeRelativePointers(relativeWeightPointers1), 
      ];
=======
    clear();
    pointerPoolSum = getPoolWeightSum(pool);
    var relativeWeightPointers;
    relativeWeightPointers = pool.filter(filterRelativeWeight);
    if (!fixedWeightPointers.length) throw FundmeError(paymentPointersMustHaveAtLeastOneFixedPointer);
    return [].concat(_toConsumableArray(normalizeFixedPointers(fixedWeightPointers, totalRelativeChance)), _toConsumableArray(normalizeRelativePointers(relativeWeightPointers)));
>>>>>>> parent of fd157ad... migrate babel -> swc
  }

  function filterRelativeWeight(pointer) {
<<<<<<< HEAD
      if (pointer.weight === undefined) return false;
      let weight = pointer.weight;
      if (typeof weight === 'string' && weight.endsWith('%')) {
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
=======
    var _pointer$address, _pointer$address2;

    if (pointer.weight === undefined) throw FundmeError(invalidWeight((_pointer$address = pointer.address) !== null && _pointer$address !== void 0 ? _pointer$address : pointer, ""));
    var weight = pointer.weight;

    if (typeof weight === "string" && weight.endsWith("%")) {
      var convertedWeight = weight.slice(0, -1);

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

    throw FundmeError(invalidWeight((_pointer$address2 = pointer.address) !== null && _pointer$address2 !== void 0 ? _pointer$address2 : pointer, weight));
>>>>>>> parent of fd157ad... migrate babel -> swc
  }

  function registerRelativeWeight(pointer) {
<<<<<<< HEAD
      pointer.weight = getRelativeWeight(pointer);
      relativeWeightPointers.push(pointer);
=======
    pointer.weight = getWeight(pointer);
    relativeWeightPointers.push(pointer);
>>>>>>> parent of fd157ad... migrate babel -> swc
  }
  function registerFixedWeight(pointer) {
      if (typeof pointer.weight === 'string') {
          pointer.weight = parseFloat(pointer.weight);
      }
      fixedWeightPointers.push(pointer);
  }

  function normalizeFixedPointers(pool, chance) {
<<<<<<< HEAD
      if (chance > 1 || chance === NaN) throw FundmeError(relativeWeightChanceError);
      chance = 1 - chance;
      // decrease all fixed pointer weights
      // based on total relative chance registered
      return pool.map((pointer)=>{
          let weight;
          if (typeof pointer.weight === 'string') {
              weight = parseFloat(pointer.weight);
          } else {
              var _weight;
              weight = (_weight = pointer.weight) !== null && _weight !== void 0 ? _weight : DEFAULT_WEIGHT;
          }
          pointer.weight = weight * chance;
          return pointer;
      });
=======
    if (chance > 1 || chance === NaN) throw FundmeError(relativeWeightChanceError);
    chance = 1 - chance;
    return pool.map(function (pointer) {
      var weight;

      if (typeof pointer.weight === "string") {
        weight = parseFloat(pointer.weight);
      } else {
        weight = pointer.weight;
      }

      pointer.weight = weight * chance;
      return pointer;
    });
>>>>>>> parent of fd157ad... migrate babel -> swc
  }

  function normalizeRelativePointers(pool, sum) {
      return pool.map((pointer)=>{
          return pointer;
      });
  }
<<<<<<< HEAD
  function getRelativeWeight(pointer) {
      let chance;
      if (typeof pointer === 'string') {
          const weight = pointer.split('#')[1];
          if (pointer.endsWith('%')) {
              chance = parseFloat(weight) / 100;
          } else {
              throw FundmeError(relativeWeightMustEndsWithPercentage);
          }
      } else {
          if (!pointer.weight) {
              throw FundmeError(weightForRelativePointerNotFound(pointer.address));
          }
          if (typeof pointer.weight === 'string') {
              if (!pointer.weight.endsWith('%')) throw FundmeError(relativeWeightMustEndsWithPercentage);
              pointer.weight = parseFloat(pointer.weight);
          } else {
              throw FundmeError(invalidRelativeWeight(pointer.address));
          }
          chance = pointer.weight / 100;
      }
      totalRelativeChance += chance;
      return pointerPoolSum * chance; // TODO - add % unit to calculate weight
  }

  const DEFAULT_WEIGHT = 5;
  // TODO check pointer.address with RegEx
  function setPointerMultiple(pointers, options = {
  }) {
      let pool = createPool(pointers);
      pool = calculateRelativeWeight(pool);
      const pickedPointer = pickPointer(pool);
      const pointerAddress = getPointerAddress(pickedPointer);
      setCurrentPointer(pool);
      if (isBrowser(options)) {
          return setWebMonetizationPointer(pointerAddress);
      }
      return pointerAddress;
=======

  function getWeight(pointer) {
    var chance;

    if (typeof pointer === "string") {
      var weight = pointer.split("#")[1];

      if (pointer.endsWith("%")) {
        chance = parseFloat(weight) / 100;
      } else {
        throw FundmeError(relativeWeightMustEndsWithPercentage);
      }
    } else {
      if (!pointer.weight) {
        var _pointer$address3;

        throw FundmeError(weightForRelativePointerNotFound((_pointer$address3 = pointer.address) !== null && _pointer$address3 !== void 0 ? _pointer$address3 : pointer));
      }

      if (typeof pointer.weight === "string") pointer.weight = parseFloat(pointer.weight);
      chance = pointer.weight / 100;
    }

    totalRelativeChance += chance;
    return pointerPoolSum * chance; // TODO - add % unit to calculate weight
  } // Jest related functions

  var DEFAULT_WEIGHT = 5; // TODO check pointer.address with RegEx

  function setPointerMultiple(pointers) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var pool = createPool(pointers);
    pool = calculateRelativeWeight(pool);
    var pickedPointer = pickPointer(pool);
    var pointerAddress = getPointerAddress(pickedPointer);
    setCurrentPointer(pool);

    if (isBrowser(options)) {
      return setWebMonetizationPointer(pointerAddress);
    }

    return pointerAddress;
>>>>>>> parent of fd157ad... migrate babel -> swc
  }
  function getPointerAddress(pointer) {
      const address = pointer.address;
      if (!address) {
          throw FundmeError(addressNotFound);
      } else if (typeof address !== 'string') {
          throw FundmeError(addressIsNotAString);
      }
      return address;
  }
  function createPool(pointers) {
      return pointers.map((pointer)=>{
          let wmPointer;
          if (typeof pointer === 'string') pointer = convertToPointer(pointer);
          if (!hasAddress(pointer)) throw FundmeError(addressNotFound);
          wmPointer = checkWeight(pointer);
          return wmPointer;
      });
  }
  // TODO update checkWeight to use relative weight instead
  function checkWeight(pointer) {
      if (pointer.weight === undefined || pointer.weight === NaN) {
          // if (window) console.warn(weightIsNotANumber(pointer.address));
          pointer.weight = DEFAULT_WEIGHT;
      }
      return pointer;
  }
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
          weight = split[1];
      }
      const pointer = {
          address,
          weight
      };
      return checkWeight(pointer);
  }

  function isMultiplePointer(s) {
      return Array.isArray(s);
  }
  function setWebMonetizationPointer(address) {
      let wmAddress = document.head.querySelector('meta[name="monetization"]');
      return setWebMonetizationTag(wmAddress, address);
  }
  function setWebMonetizationTag(wmAddress, address) {
      if (!wmAddress) {
          wmAddress = createWebMonetizationTag(address);
      } else {
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
      const weights = pointers.map((pointer)=>{
          var _weight;
          return (_weight = pointer.weight) !== null && _weight !== void 0 ? _weight : DEFAULT_WEIGHT; // TODO - safecheck null assertion
      });
      return Object.values(weights).reduce((sum, weight)=>{
          if (isNumberOnly(weight)) {
              if (typeof weight === 'string') weight = parseFloat(weight);
              return sum + weight;
          } else {
              return sum;
          }
      }, 0);
  }
  function getWinningPointer(pointers, choice) {
      for(const pointer in pointers){
          var _weight;
          const weight = (_weight = pointers[pointer].weight) !== null && _weight !== void 0 ? _weight : DEFAULT_WEIGHT; // TODO - safecheck null assertion
          if (typeof weight !== 'number') throw FundmeError(getWinningPointerMustBeANumber);
          if ((choice -= weight) <= 0) {
              return pointers[pointer];
          }
      }
<<<<<<< HEAD
      // Decide if this will be the default behavior later
      // in case unexpected case where choice is greater than all pointers' weight
      return pointers[0];
=======
    }

    console.error("GET WINNING POOL LEAKED!");
    return {
      address: ""
    }; // Is this even necessary?
>>>>>>> parent of fd157ad... migrate babel -> swc
  }
  function hasAddress(obj) {
      if (!obj) return false;
      return Object.keys(obj).some((str)=>str === 'address'
      );
  }
  let defaultAddress;
  function setDefaultAddress(address, options = {
  }) {
      if (Array.isArray(address)) {
          if (address.length) {
              defaultAddress = createPool(address);
              return;
          } else {
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
          // @ts-ignore
          defaultAddress = undefined; // TODO check if ts-ignore break things
          return;
      }
      throw FundmeError(invalidDefaultAddress);
  }
  function getDefaultAddress() {
      return defaultAddress;
  }
  function defaultAddressMultiple(address) {
      return isMultiplePointer(address) ? address : [
          address
      ];
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
      } else {
          if (currentPointer) return currentPointer.toString();
          throw FundmeError(getCurrentPointerAddressMustClientSide);
      }
  }
  function cleanSinglePointerSyntax(pointer) {
      if (typeof pointer === 'string') {
          pointer = pointer.split('#')[0];
      } else {
          throw FundmeError(canOnlyCleanStringCustomSyntax);
      }
      return pointer;
  }
  function getCurrentPointerPool() {
      let pointer = currentPointer;
      return convertToPointerPool(pointer);
  }
  function convertToPointerPool(pointer) {
      if (!Array.isArray(pointer) && pointer !== undefined) {
          pointer = [
              pointer
          ];
      }
      return pointer || [];
  }
  function isNumberOnly(text) {
      if (typeof text === 'string') {
          const regex = /^[0-9]*$/;
          return regex.test(text);
      }
      return typeof text === 'number';
  }

  function setPointerSingle(pointer, options = {
  }) {
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
  function setPointerFromTemplates(options = {
  }) {
      const pointers = [
          ...scrapeTemplate(),
          ...scrapeJson(),
          ...scrapeCustomSyntax(), 
      ];
      if (pointers.length) {
          setPointerMultiple(pointers, options);
      } else {
          throw FundmeError(noTemplateFound);
      }
  }
  // DON'T throw errors inside scrape functions if array is found to be empty
  // fund() already do that
  function scrapeJson() {
      const scriptTags = document.body.querySelectorAll(FUNDME_JSON_SELECTOR);
      let pointers = [];
      if (scriptTags.length) {
          scriptTags.forEach((json)=>{
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
      } catch (err) {
          throw FundmeError(cannotParseScriptJson);
      }
      if (json.type !== 'application/json') {
          throw FundmeError(scriptFundmeIsNotApplicationJson);
      }
      if (Array.isArray(parsed)) {
          pointers = createPool(parsed);
      } else if (typeof parsed === 'string') {
          pointers = createPool([
              parsed
          ]);
      } else {
          throw FundmeError(jsonTemplateIsInvalid);
      }
      return pointers;
  }
  function scrapeTemplate() {
      const templates = document.body.querySelectorAll(FUNDME_TEMPLATE_SELECTOR);
      let pointers = [];
      if (templates.length) {
          templates.forEach((template)=>{
              const pointer = parseTemplate(template);
              pointers = [
                  ...pointers,
                  pointer
              ];
          });
      }
      return pointers;
  }
  function parseTemplate(template) {
      let address = template.dataset.fund;
      var _fundWeight;
      let weight = (_fundWeight = template.dataset.fundWeight) !== null && _fundWeight !== void 0 ? _fundWeight : DEFAULT_WEIGHT;
      if (!address) {
          throw FundmeError(failParsingTemplate);
      }
      const pointer = checkWeight({
          address,
          weight
      });
      return pointer;
  }
  function scrapeCustomSyntax() {
      const templates = document.querySelectorAll(FUNDME_CUSTOM_SYNTAX_SELECTOR);
      let pointers = [];
      if (templates.length) {
          templates.forEach((template)=>{
              pointers = [
                  ...pointers,
                  ...parseCustomSyntax(template)
              ];
          });
      }
      return pointers;
  }
  function parseCustomSyntax(template) {
      let pointers = [];
      const temp = template.innerHTML;
      temp.split(';').forEach((str)=>{
          const strippedString = str.replace(/(^\s+|\s+$)/g, '');
          if (strippedString) {
              pointers = [
                  ...pointers,
                  convertToPointer(strippedString)
              ];
          }
      });
      return pointers;
  }

<<<<<<< HEAD
  function clientSideFund(pointer, options) {
      if (pointer === undefined || pointer === null) {
          setPointerFromTemplates();
          return setFundType(FundType.isFromTemplate);
      }
      if (options && options.force === 'server') {
          throw FundmeError(invalidFundmeServerSide);
      }
      if (typeof pointer === 'string') {
          if (pointer === 'default') {
              if (getDefaultAddress() !== undefined) {
                  if (typeof getDefaultAddress() === 'string') {
                      setPointerSingle(getDefaultAddress().toString(), options);
                  } else {
                      setPointerMultiple(defaultAddressMultiple(getDefaultAddress()), options);
                  }
                  return setFundType(FundType.isDefault);
              } else {
                  throw FundmeError(defaultAddressNotFound);
              }
=======
  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  	  path: basedir,
  	  exports: {},
  	  require: function (path, base) {
        return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
      }
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var lib = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  /* global window self */

  var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

  /* eslint-disable no-restricted-globals */
  var isWebWorker = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
  /* eslint-enable no-restricted-globals */

  var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

  /**
   * @see https://github.com/jsdom/jsdom/releases/tag/12.0.0
   * @see https://github.com/jsdom/jsdom/issues/1537
   */
  /* eslint-disable no-undef */
  var isJsDom = function isJsDom() {
    return typeof window !== 'undefined' && window.name === 'nodejs' || navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom');
  };

  exports.isBrowser = isBrowser;
  exports.isWebWorker = isWebWorker;
  exports.isNode = isNode;
  exports.isJsDom = isJsDom;
  });

  var index = /*@__PURE__*/unwrapExports(lib);

  function clientSideFund(pointer) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (pointer === undefined) {
      setPointerFromTemplates();
      return setFundType(FundType.isFromTemplate);
    }

    if (typeof pointer === "string") {
      if (pointer === "default") {
        if (getDefaultAddress() !== undefined) {
          if (typeof getDefaultAddress() === "string") {
            setPointerSingle(getDefaultAddress().toString(), options);
          } else {
            setPointerMultiple(defaultAddressMultiple(getDefaultAddress()), options);
>>>>>>> parent of fd157ad... migrate babel -> swc
          }
          setPointerSingle(pointer, options);
          return setFundType(FundType.isSingle);
      }
<<<<<<< HEAD
      if (isMultiplePointer(pointer)) {
          setPointerMultiple(pointer, options);
          return setFundType(FundType.isMultiple);
      }
      throw FundmeError(invalidAddress);
  }
  let forceBrowser = false;
  const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
  const isBrowser = (options = {
  })=>{
      if (options.force === 'server') return false;
      const forced = forceBrowser;
      forceBrowser = false;
      return !isNode || forced || options.force === 'client';
  };

  function serverSideFund(pointer) {
      if (pointer === null || pointer === undefined) throw FundmeError(noUndefinedFundOnServerSide);
      if (typeof pointer === 'string') {
          return setPointerSingle(pointer).toString();
      }
      if (isMultiplePointer(pointer)) {
          return setPointerMultiple(pointer).toString();
      }
      throw FundmeError(invalidFundmeServerSide);
=======

      setPointerSingle(pointer, options);
      return setFundType(FundType.isSingle);
    }

    if (isMultiplePointer(pointer)) {
      setPointerMultiple(pointer, options);
      return setFundType(FundType.isMultiple);
    }

    throw FundmeError(invalidAddress);
  }
  var forceBrowser = false;
  var isBrowser = function isBrowser() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (options.force === "server") return false;
    var forced = forceBrowser;
    forceBrowser = false;
    return !index.isNode || forced || options.force === "client";
  };

  function serverSideFund(pointer) {
    if (pointer === undefined) throw FundmeError(noUndefinedFundOnServerSide);

    if (typeof pointer === "string") {
      return setPointerSingle(pointer).toString();
    }

    if (isMultiplePointer(pointer)) {
      return setPointerMultiple(pointer).toString();
    }

    throw FundmeError(invalidFundmeServerSide);
>>>>>>> parent of fd157ad... migrate babel -> swc
  }

  var FundType;
  (function(FundType1) {
      FundType1['isSingle'] = 'single';
      FundType1['isMultiple'] = 'multiple';
      FundType1['isDefault'] = 'default';
      FundType1['isFromTemplate'] = 'template';
      FundType1['isUndefined'] = 'undefined';
  })(FundType || (FundType = {
  }));
  function fund(pointer, options = {
  }) {
      if (isBrowser(options)) {
          return clientSideFund(pointer, options);
      } else {
          if (pointer === undefined) {
              throw FundmeError(noUndefinedFundOnServerSide);
          } else {
              return serverSideFund(pointer);
          }
      }
  }

  exports.fund = fund;
  exports.getCurrentPointerAddress = getCurrentPointerAddress;
  exports.getCurrentPointerPool = getCurrentPointerPool;
  exports.setDefaultAddress = setDefaultAddress;

  Object.defineProperty(exports, '__esModule', { value: true });

});
