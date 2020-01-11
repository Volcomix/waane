import { createFilter } from '@rollup/pluginutils'
import cheerio from 'cheerio'

export default function rollupPlugin(options = {}) {
  const filter = createFilter(options.include, options.exclude)

  return {
    transform(code, id) {
      if (!filter(id)) return

      const $ = cheerio.load(code)
      const style = $('style').html()
      const template = $('template').html()
      const script = $('script').html()

      return {
        code: script.replace(
          /(class\s+\S+\s+extends\s+WaaneElement\s*{)/g,
          `$1${injectStyles(style)}${injectTemplate(template)}`,
        ),
        map: { mappings: '' },
      }
    },
  }
}

function injectStyles(style) {
  if (!style) {
    return ''
  }
  return `
    static get styles() {
      return \`${style.replace(/@include\s+(.*)\s*;/g, `\${$1}`)}\`   }
`
}

function injectTemplate(template) {
  if (!template) {
    return ''
  }
  return `
    static get template() {
      return \`${template}\`   }
`
}
