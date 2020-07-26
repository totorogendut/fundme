var fundme = (function (exports, util) {
  'use strict';

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

  let relativeWeightPointers = [];
  let fixedWeightPointers = [];
  let totalRelativeChance = 0;
  let pointerPoolSum = 0;
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
  }
  function filterRelativeWeight(pointer) {
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
  }
  function registerRelativeWeight(pointer) {
      pointer.weight = getRelativeWeight(pointer);
      relativeWeightPointers.push(pointer);
  }
  function registerFixedWeight(pointer) {
      if (typeof pointer.weight === 'string') {
          pointer.weight = parseFloat(pointer.weight);
      }
      fixedWeightPointers.push(pointer);
  }
  function normalizeFixedPointers(pool, chance) {
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
  }
  function normalizeRelativePointers(pool, sum) {
      return pool.map((pointer)=>{
          return pointer;
      });
  }
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
      // Decide if this will be the default behavior later
      // in case unexpected case where choice is greater than all pointers' weight
      return pointers[0];
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

  return exports;

}({}, util));
