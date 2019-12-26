export function html(strings, ...substitutions) {
  const template = document.createElement('template')
  template.innerHTML = String.raw(strings, ...substitutions)
  return template
}

export class WaaneElement extends HTMLElement {
  constructor() {
    super()
    this._setters = {}
    this._initShadowRoot()
    this._initAttributes()
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    this[this._setters[name]] = newValue
  }

  get _template() {
    return getTemplate.call(this, this.tagName)
  }

  get _attributes() {
    return getObservedAttributes.call(this, this.tagName)
  }

  _initShadowRoot() {
    const template = this._template
    if (!template) return

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  _initAttributes() {
    const attributes = this._attributes
    if (!attributes) return

    for (const attribute of attributes) {
      const property = toCamelCase(attribute)
      this._registerSetter(attribute, property)
      this._registerProperty(attribute, property)
    }
  }

  _registerSetter(attribute, property) {
    this._setters[attribute] = `_${property}`
  }

  _registerProperty(attribute, property) {
    Object.defineProperty(this, property, {
      get() {
        return this.getAttribute(attribute)
      },
      set(value) {
        this.setAttribute(attribute, value)
      },
    })
  }
}

const getTemplate = memoize(function() {
  return this.constructor.template
})

const getObservedAttributes = memoize(function() {
  return this.constructor.observedAttributes
})

const toCamelCase = memoize(function(string) {
  return string.toLowerCase().replace(/-(.)/g, (_match, p1) => p1.toUpperCase())
})

function memoize(fn) {
  const cache = {}
  return function(argument) {
    let result = cache[argument]
    if (!result) {
      result = fn.call(this, argument)
      cache[argument] = result
    }
    return result
  }
}
