define(['exports'], function (exports) { 'use strict';

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function FundmeError(err) {
    return "Fundme.js: " + err;
  }
  var addressNotFound = "address not found.";
  var addressIsNotAString = "address must be a string.";
  var getCurrentPointerAddressMustClientSide = "can't use getCurrentPointerAddress() server-side.";
  var invalidAddress = "invalid Web Monetization pointer address is given."; // multiple pointers

  var getWinningPointerMustBeANumber = "all pointers' weight during calculating a winning pointer must have type of number."; // default address

  var defaultAddressNotFound = "default address not found. Use setDefaultAddress(str: string) to set it first.";
  var invalidDefaultAddress = "invalid default address.";
  var defaultAddressArrayCannotBeEmpty = "invalid default address."; // utils

  var canOnlyCleanStringCustomSyntax = "can only clean custom syntax with typeof string."; // about meta tag for Web Monetization API

  var metaTagNotFound = "web monetization meta tag is not found.";
  var metaTagMultipleIsFound = 'multiple <meta name="monetization" /> found - Web Monetization API only support a single meta tag.'; // pointers template

  var noTemplateFound = "no monetization template is found.";
  var failParsingTemplate = "fails to parse address from <template data-fund></template>.";

  var cannotParseScriptJson = "cannot parse JSON from <script fundme>. Make sure it contains a valid JSON.";
  var jsonTemplateIsInvalid = "found <script fundme> but it's not valid.";
  var scriptFundmeIsNotApplicationJson = 'found <script fundme> but its type is not "application/json"'; // relative weight

  var paymentPointersMustHaveAtLeastOneFixedPointer = "revenue sharing payment pointers must have at least one payment address pointer with fixed weight.";
  var relativeWeightChanceError = "error when calculating total relative weight chance. Make sure it's a float between 0~1.0.";
  var weightForRelativePointerNotFound = function weightForRelativePointerNotFound(address) {
    return "payment pointer weights not found for ".concat(address);
  };
  var relativeWeightMustEndsWithPercentage = "relative weights must end with character %.";
  var invalidRelativeWeight = function invalidRelativeWeight(address) {
    return "relative weight for payment pointer ".concat(address, " must be integer or float.");
  };
  var invalidWeight = function invalidWeight(address, weight) {
    return "weight for payment pointer ".concat(address, "#").concat(weight, " is invalid.");
  };
  /*****************************
   *                           *
   *  Server-side fund()       *
   *                           *
   *****************************/

  var noUndefinedFundOnServerSide = "can't use fund() with empty parameters in server side.";
  var invalidFundmeServerSide = "invalid fundme parameters on the server-side.";

  var relativeWeightPointers = [];
  var fixedWeightPointers = [];
  var totalRelativeChance = 0;
  var pointerPoolSum = 0;
  function clear() {
    relativeWeightPointers = [];
    fixedWeightPointers = [];
    totalRelativeChance = 0;
    pointerPoolSum = 0;
    return {
      relativeWeightPointers: relativeWeightPointers,
      fixedWeightPointers: fixedWeightPointers,
      totalRelativeChance: totalRelativeChance,
      pointerPoolSum: pointerPoolSum
    };
  }
  function calculateRelativeWeight(pool) {
    clear();
    pointerPoolSum = getPoolWeightSum(pool);
    var relativeWeightPointers;
    relativeWeightPointers = pool.filter(filterRelativeWeight);
    if (!fixedWeightPointers.length) throw FundmeError(paymentPointersMustHaveAtLeastOneFixedPointer);
    return [].concat(_toConsumableArray(normalizeFixedPointers(fixedWeightPointers, totalRelativeChance)), _toConsumableArray(normalizeRelativePointers(relativeWeightPointers)));
  }

  function filterRelativeWeight(pointer) {
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
  }

  function registerRelativeWeight(pointer) {
    pointer.weight = getWeight(pointer);
    relativeWeightPointers.push(pointer);
  }
  function registerFixedWeight(pointer) {
    if (typeof pointer.weight === "string") {
      pointer.weight = parseFloat(pointer.weight);
    }

    fixedWeightPointers.push(pointer);
  }

  function normalizeFixedPointers(pool, chance) {
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
  }

  function normalizeRelativePointers(pool, sum) {
    return pool.map(function (pointer) {
      return pointer;
    });
  }

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
  }
  function getPointerAddress(pointer) {
    var address = pointer.address;

    if (!address) {
      throw FundmeError(addressNotFound);
    } else if (typeof address !== "string") {
      throw FundmeError(addressIsNotAString);
    }

    return address;
  }
  function createPool(pointers) {
    return pointers.map(function (pointer) {
      var wmPointer;
      if (typeof pointer === "string") pointer = convertToPointer(pointer);
      if (!hasAddress(pointer)) throw FundmeError(addressNotFound);
      wmPointer = checkWeight(pointer);
      return wmPointer;
    });
  } // TODO update checkWeight to use relative weight instead

  function checkWeight(pointer) {
    if (pointer.weight === undefined || pointer.weight === NaN) {
      // if (window) console.warn(weightIsNotANumber(pointer.address));
      pointer.weight = DEFAULT_WEIGHT;
    }

    return pointer;
  }
  function pickPointer(pointers) {
    var sum = getPoolWeightSum(pointers);
    var choice = getChoice(sum);
    return getWinningPointer(pointers, choice);
  }
  function getChoice(sum) {
    var choice = Math.random() * sum;
    return choice;
  }
  function convertToPointer(str) {
    var address = str;
    var weight;
    var split = str.split("#");

    if (split.length > 1) {
      address = split[0];
      weight = split[1];
    }

    var pointer = {
      address: address,
      weight: weight
    };
    return checkWeight(pointer);
  }

  function isMultiplePointer(s) {
    return Array.isArray(s);
  }
  function setWebMonetizationPointer(address) {
    var wmAddress = document.head.querySelector('meta[name="monetization"]');
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
    var wmAddress = document.createElement("meta");
    wmAddress.name = "monetization";
    wmAddress.content = address;
    document.head.appendChild(wmAddress);
    return wmAddress;
  }
  function getPoolWeightSum(pointers) {
    var weights = pointers.map(function (pointer) {
      var _pointer$weight;

      return (_pointer$weight = pointer.weight) !== null && _pointer$weight !== void 0 ? _pointer$weight : DEFAULT_WEIGHT; // TODO - safecheck null assertion
    });
    return Object.values(weights).reduce(function (sum, weight) {
      if (isNumberOnly(weight)) {
        if (typeof weight === "string") weight = parseFloat(weight);
        return sum + weight;
      } else {
        return sum;
      }
    }, 0);
  }
  function getWinningPointer(pointers, choice) {
    for (var pointer in pointers) {
      var _pointers$pointer$wei;

      var _weight = (_pointers$pointer$wei = pointers[pointer].weight) !== null && _pointers$pointer$wei !== void 0 ? _pointers$pointer$wei : DEFAULT_WEIGHT; // TODO - safecheck null assertion


      if (typeof _weight !== "number") throw FundmeError(getWinningPointerMustBeANumber);

      if ((choice -= _weight) <= 0) {
        return pointers[pointer];
      }
    }

    console.error("GET WINNING POOL LEAKED!");
    return {
      address: ""
    }; // Is this even necessary?
  }
  function hasAddress(obj) {
    if (!obj) return false;
    return Object.keys(obj).some(function (str) {
      return str === "address";
    });
  }
  var defaultAddress;
  function setDefaultAddress(address) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (Array.isArray(address)) {
      if (address.length) {
        defaultAddress = createPool(address);
        return;
      } else {
        throw FundmeError(defaultAddressArrayCannotBeEmpty);
      }
    }

    if (typeof address === "string") {
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
    return isMultiplePointer(address) ? address : [address];
  }
  var currentFundType;
  function setFundType(type) {
    currentFundType = type;
    return currentFundType;
  }
  var currentPointer;
  function setCurrentPointer(pointer) {
    currentPointer = pointer;
  }
  function getCurrentPointerAddress() {
    // const forced = forceBrowser
    if (isBrowser()) {
      var metaTag = document.head.querySelectorAll('meta[name="monetization"]');

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
    if (typeof pointer === "string") {
      pointer = pointer.split("#")[0];
    } else {
      throw FundmeError(canOnlyCleanStringCustomSyntax);
    }

    return pointer;
  }
  function getCurrentPointerPool() {
    var pointer = currentPointer;
    return convertToPointerPool(pointer);
  }
  function convertToPointerPool(pointer) {
    if (!Array.isArray(pointer) && pointer !== undefined) {
      pointer = [pointer];
    }

    return pointer || [];
  }
  function isNumberOnly(text) {
    if (typeof text === "string") {
      var regex = /^[0-9]*$/;
      return regex.test(text);
    }

    return typeof text === "number";
  }

  function setPointerSingle(pointer) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    pointer = cleanSinglePointerSyntax(pointer);
    setCurrentPointer(pointer);

    if (isBrowser(options)) {
      return setWebMonetizationPointer(pointer);
    }

    return pointer;
  }

  var FUNDME_TEMPLATE_SELECTOR = "template[data-fund]";
  var FUNDME_CUSTOM_SYNTAX_SELECTOR = "template[fundme]";
  var FUNDME_JSON_SELECTOR = "script[fundme]";
  function setPointerFromTemplates() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var pointers = [].concat(_toConsumableArray(scrapeTemplate()), _toConsumableArray(scrapeJson()), _toConsumableArray(scrapeCustomSyntax()));

    if (pointers.length) {
      setPointerMultiple(pointers, options);
    } else {
      throw FundmeError(noTemplateFound);
    }
  } // DON'T throw errors inside scrape functions if array is found to be empty
  // fund() already do that

  function scrapeJson() {
    var scriptTags = document.body.querySelectorAll(FUNDME_JSON_SELECTOR);
    var pointers = [];

    if (scriptTags.length) {
      scriptTags.forEach(function (json) {
        pointers = parseScriptJson(json);
      });
    }

    return pointers;
  }

  function parseScriptJson(json) {
    var pointers = [];
    var parsed;

    try {
      parsed = JSON.parse(json.innerHTML);
    } catch (err) {
      throw FundmeError(cannotParseScriptJson);
    }

    if (json.type !== "application/json") {
      throw FundmeError(scriptFundmeIsNotApplicationJson);
    }

    if (Array.isArray(parsed)) {
      pointers = createPool(parsed);
    } else if (typeof parsed === "string") {
      pointers = createPool([parsed]);
    } else {
      throw FundmeError(jsonTemplateIsInvalid);
    }

    return pointers;
  }

  function scrapeTemplate() {
    var templates = document.body.querySelectorAll(FUNDME_TEMPLATE_SELECTOR);
    var pointers = [];

    if (templates.length) {
      templates.forEach(function (template) {
        var pointer = parseTemplate(template);
        pointers = [].concat(_toConsumableArray(pointers), [pointer]);
      });
    }

    return pointers;
  }
  function parseTemplate(template) {
    var _template$dataset$fun;

    var address = template.dataset.fund;
    var weight = (_template$dataset$fun = template.dataset.fundWeight) !== null && _template$dataset$fun !== void 0 ? _template$dataset$fun : DEFAULT_WEIGHT;

    if (!address) {
      throw FundmeError(failParsingTemplate);
    }

    var pointer = checkWeight({
      address: address,
      weight: weight
    });
    return pointer;
  }
  function scrapeCustomSyntax() {
    var templates = document.querySelectorAll(FUNDME_CUSTOM_SYNTAX_SELECTOR);
    var pointers = [];

    if (templates.length) {
      templates.forEach(function (template) {
        pointers = [].concat(_toConsumableArray(pointers), _toConsumableArray(parseCustomSyntax(template)));
      });
    }

    return pointers;
  }
  function parseCustomSyntax(template) {
    var pointers = [];
    var temp = template.innerHTML;
    temp.split(";").forEach(function (str) {
      var strippedString = str.replace(/(^\s+|\s+$)/g, "");

      if (strippedString) {
        pointers = [].concat(_toConsumableArray(pointers), [convertToPointer(strippedString)]);
      }
    });
    return pointers;
  }

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
          }

          return setFundType(FundType.isDefault);
        } else {
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

    throw FundmeError(invalidAddress);
  }
  var forceBrowser = false;
  var isBrowser = function isBrowser$1() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (options.force === "server") return false;
    var forced = forceBrowser;
    forceBrowser = false;
    return index.isBrowser() || forced || options.force === "client";
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
  }

  var FundType;

  (function (FundType) {
    FundType["isSingle"] = "single";
    FundType["isMultiple"] = "multiple";
    FundType["isDefault"] = "default";
    FundType["isFromTemplate"] = "template";
    FundType["isUndefined"] = "undefined";
  })(FundType || (FundType = {}));

  function fund(pointer) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
