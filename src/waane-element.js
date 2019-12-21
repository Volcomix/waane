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

  get _template() {
    return this._memoizeStaticProperty('template')
  }

  get _attributes() {
    return this._memoizeStaticProperty('observedAttributes')
  }

  _initShadowRoot() {
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(this._template.content.cloneNode(true))
  }

  _initAttributes() {
    const attributes = this._attributes
    if (attributes) {
      for (const attribute of attributes) {
        const property = toCamelCase(attribute)
        this._registerSetter(attribute, property)
        this._registerProperty(attribute, property)
      }
    }
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    this[this._setters[name]] = newValue
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

  _memoizeStaticProperty(staticProperty) {
    const cache = getCache(staticProperty)
    const name = this.constructor.name
    let value = cache[name]
    if (!value) {
      value = this.constructor[staticProperty]
      cache[name] = value
    }
    return value
  }
}

function toCamelCase(string) {
  return string.toLowerCase().replace(/-(.)/g, (_match, p1) => p1.toUpperCase())
}

const staticPropertiesCache = {}

function getCache(name) {
  let cache = staticPropertiesCache[name]
  if (!cache) {
    cache = {}
    staticPropertiesCache[name] = cache
  }
  return cache
}
