import { checkWeight, setPointerMultiple, DEFAULT_WEIGHT, createPool } from './set-pointer-multiple'
import { setPointerSingle } from './set-pointer-single'
import {
  noTemplateFound,
  failParsingTemplate,
  scriptFundmeIsNotApplicationJson,
  cannotParseScriptJson,
  jsonTemplateIsNotArray,
} from './errors'

export const FUNDME_TEMPLATE_SELECTOR = 'template[data-fund]'
export const FUNDME_JSON_SELECTOR = 'script[fundme]'

export function setPointerFromTemplates(): void {
  const pointers: WMPointer[] = [...scrapeTemplate(), ...scrapeJson()]

  if (pointers.length > 1) {
    setPointerMultiple(pointers)
  } else if (pointers.length === 1) {
    setPointerSingle(pointers[0].address)
    // if (typeof pointers[0] !== 'string') {
    //   console.warn(templateSinglePointerHasWeight)
    // }
  } else {
    throw new Error(noTemplateFound)
  }
}

// DON'T throw errors inside scrape functions if array is found to be empty
// fund() already do that
export function scrapeJson(): WMPointer[] {
  const scriptTags: NodeListOf<HTMLScriptElement> = document.body.querySelectorAll(FUNDME_JSON_SELECTOR)
  let pointers: WMPointer[] = []

  if (scriptTags.length > 0) {
    scriptTags.forEach((json) => {
      pointers = parseScriptJson(json)
    })
  }

  return pointers
}

function parseScriptJson(json: HTMLScriptElement): WMPointer[] {
  let pointers: WMPointer[] = []

  try {
    pointers = JSON.parse(json.innerHTML)
  } catch (err) {
    throw new Error(cannotParseScriptJson)
  }

  if (json.type !== 'application/json') {
    throw new Error(scriptFundmeIsNotApplicationJson)
  }

  if (Array.isArray(pointers)) {
    pointers = createPool(pointers)
  } else {
    throw new Error(jsonTemplateIsNotArray)
  }

  return pointers
}

export function scrapeTemplate(): WMPointer[] {
  const templates: NodeListOf<HTMLMetaElement> = document.body.querySelectorAll(FUNDME_TEMPLATE_SELECTOR)
  let pointers: WMPointer[] = []

  if (templates.length > 0) {
    templates.forEach((template) => {
      const pointer: WMPointer = parseTemplate(template)
      pointers = [...pointers, pointer]
    })
  }

  return pointers
}

export function parseTemplate(template: any): WMPointer {
  let address: string = template.dataset.fund
  let weight: number =
    template.dataset.fundWeight !== undefined ? parseInt(template.dataset.fundWeight, 0) : DEFAULT_WEIGHT

  if (!address) {
    throw new Error(failParsingTemplate)
  }

  const pointer: WMPointer = checkWeight({
    address,
    weight,
  })

  return pointer
}
