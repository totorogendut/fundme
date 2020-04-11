import { fund } from '../../../src/fund/main'
import {
  noTemplateFound,
  jsonTemplateIsInvalid,
  cannotParseScriptJson,
  failParsingTemplate,
} from '../../../src/fund/errors'

describe('test scraping template crashes resulting right throw errors', () => {
  test('fund() is called but no template is found', () => {
    document.body.innerHTML = ''
    expect(() => fund()).toThrowError(noTemplateFound)
    document.body.innerHTML = ''
  })

  test("found <script fundme> but it's not an array", () => {
    document.body.innerHTML = `
      <script fundme type="application/json">
        {
          "address": "$coil.com/my-test",
          "weight": 6
        }
      </script>
    `
    expect(() => fund()).toThrowError(jsonTemplateIsInvalid)
    document.body.innerHTML = ''
  })

  test("found <script fundme> but it's not a valid JSON", () => {
    document.body.innerHTML = `
      <script fundme type="application/json">
        $coil.com/test-@@
      </script>
    `
    expect(() => fund()).toThrowError(cannotParseScriptJson)
    document.body.innerHTML = ''
  })

  // parse template errors
  test('fails to parse address from <template data-fund></template>', () => {
    document.body.innerHTML = `
      <template data-fund="" />
    `
    function fundThrow() {
      fund()
    }
    expect(fundThrow).toThrowError(failParsingTemplate)
    document.body.innerHTML = ''
  })
})
