import { DEFAULT_WEIGHT } from './set-pointer-multiple'

export const defaultAddressNotFound =
  'Fundme.js: default address not found. Use setDefaultAddress(str: string) to set it first.'
export const invalidAddress = 'Fundme.js: Invalid Web Monetization pointer address is given.'
export const addressNotFound = 'Fundme.js: address not found.'
export const addressIsNotAString = 'Fundme.js: address must be a string.'
export const weightNotFound = 'Fundme.js: entries .weight not found.'
export function weightIsNotANumber(str: string) {
  return `Fundme.js: ${str} has weight that is not a number. It has been set to ${DEFAULT_WEIGHT} (default).`
}

// about meta tag for Web Monetization API
export const metaTagNotFound = 'Fundme.js: web monetization meta tag is not found.'
export const metaTagMultipleIsFound =
  'Fundme.js: multiple <meta name="monetization" /> found - Web Monetization API only support a single meta tag.'

// pointers template
export const noTemplateFound = 'Fundme.js: no monetization template is found.'
export const failParsingTemplate = 'Fundme.js: fails to parse address from <template data-fund></template>.'
export const templateSinglePointerHasWeight =
  'Fundme.js: found single <template data-fund></template> but has weight - only address will be parsed.'

// script json template
export const cannotParseScriptJson =
  'Fundme.js: cannot parse JSON from <script fundme>. Make sure it contains a valid JSON.'
export const jsonTemplateIsInvalid = "Fundme.js: found <script fundme> but it's not valid."
export const scriptFundmeIsNotApplicationJson =
  'Fundme.js: found <script fundme> but its type is not "application/json"'
