export function html(strings, ...substitutions) {
  const template = document.createElement('template')
  template.innerHTML = String.raw(strings, ...substitutions)
  return template
}

const templates = {}

export class WaaneElement extends HTMLElement {
  constructor() {
    super()
    this._updateMethods = {}
    this._initShadowRoot()
    this._initAttributes()
  }

  get _template() {
    const name = this.constructor.name
    let template = templates[name]
    if (!template) {
      template = this.constructor.template
      templates[name] = template
    }
    return template
  }

  _initShadowRoot() {
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(this._template.content.cloneNode(true))
  }

  _initAttributes() {
    const attributes = this.constructor.observedAttributes
    if (attributes) {
      for (const attribute of attributes) {
        this._registerUpdateMethod(attribute)
        this._registerProperty(attribute)
      }
    }
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    this[this._updateMethods[name]](newValue)
  }

  _registerUpdateMethod(attribute) {
    this._updateMethods[attribute] = `_update${toPascalCase(attribute)}`
  }

  _registerProperty(attribute) {
    Object.defineProperty(this, toCamelCase(attribute), {
      get() {
        return this.getAttribute(attribute)
      },
      set(value) {
        this.setAttribute(attribute, value)
      },
    })
  }
}

function toPascalCase(string) {
  return string
    .toLowerCase()
    .replace(/(^|-)(.)/g, (_match, _p1, p2) => p2.toUpperCase())
}

function toCamelCase(string) {
  return string.toLowerCase().replace(/-(.)/g, (_match, p1) => p1.toUpperCase())
}
