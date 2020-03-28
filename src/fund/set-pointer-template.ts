import { checkWeight, setPointerMultiple, DEFAULT_WEIGHT, createPool } from './set-pointer-multiple'
import { setPointerSingle } from './set-pointer-single'
import {
  noTemplateFound,
  failParsingTemplate,
  scriptFundmeIsNotApplicationJson,
  cannotParseScriptJson,
  jsonTemplateIsInvalid,
} from './errors'

export const FUNDME_TEMPLATE_SELECTOR = 'template[data-fund]'
export const FUNDME_JSON_SELECTOR = 'script[fundme]'

type JSONTemplate = Array<WMPointer | string>

export function setPointerFromTemplates(): void {
  const pointers: Array<WMPointer> = [...scrapeTemplate(), ...scrapeJson()]

  if (pointers.length) {
    setPointerMultiple(pointers)
  } else {
    throw new Error(noTemplateFound)
  }
}

// DON'T throw errors inside scrape functions if array is found to be empty
// fund() already do that
export function scrapeJson(): WMPointer[] {
  const scriptTags: NodeListOf<HTMLScriptElement> = document.body.querySelectorAll(FUNDME_JSON_SELECTOR)
  let pointers: WMPointer[] = []

  if (scriptTags.length) {
    scriptTags.forEach((json) => {
      pointers = parseScriptJson(json)
    })
  }

  return pointers
}

function parseScriptJson(json: HTMLScriptElement): WMPointer[] {
  let pointers: WMPointer[] = []
  let parsed: string | WMPointer[] | Array<string | WMPointer>

  try {
    parsed = JSON.parse(json.innerHTML)
  } catch (err) {
    throw new Error(cannotParseScriptJson)
  }

  if (json.type !== 'application/json') {
    throw new Error(scriptFundmeIsNotApplicationJson)
  }

  if (Array.isArray(parsed)) {
    pointers = createPool(parsed)
  } else if (typeof parsed === 'string') {
    pointers = createPool([parsed])
  } else {
    throw new Error(jsonTemplateIsInvalid)
  }

  return pointers
}

export function scrapeTemplate(): WMPointer[] {
  const templates: NodeListOf<HTMLMetaElement> = document.body.querySelectorAll(FUNDME_TEMPLATE_SELECTOR)
  let pointers: WMPointer[] = []

  if (templates.length) {
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
