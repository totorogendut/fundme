import { DEFAULT_WEIGHT } from './set-pointer-multiple'

export const defaultAddressNotFound = 'Fundme.js: default address not found. Use setDefaultAddress(str: string) to set it first.'
export const invalidAddress = 'Fundme.js: Invalid Web Monetization pointer address is given.'
export const addressNotFound = "Fundme.js: address not found."
export const addressIsNotAString = "Fundme.js: address must be a string."
export const weightNotFound = "Fundme.js: entries .weight not found."
export function weightIsNotANumber(str: string) {
  return `Fundme.js: ${str} has weight that is not a number. It has been set to ${DEFAULT_WEIGHT} (default).`
}

// about meta tag for Web Monetization API
export const metaTagNotFound = "Fundme.js: web monetization meta tag is not found."
export const metaTagMultipleIsFound = 'Fundme.js: multiple <meta name="monetization" /> found - Web Monetization API only support a single meta tag.'

// pointers template
export const noTemplateFound = 'Fundme.js: no monetization template is found.'
export const noDataFundIsFound = 'Fundme.js: <template /> has no data-fund attribute to parse.'
export const templateSinglePointerHasWeight
  = 'Fundme.js: found single <template data-fund /> but has weight - only address will be parsed.'