export const html = String.raw
export const css = String.raw

export class WaaneElement extends HTMLElement {
  static get observedAttributes() {
    const propertyTypes = this.properties
    if (propertyTypes) {
      return Object.keys(propertyTypes).map(toKebabCase)
    }
  }

  constructor() {
    super()
    this._setters = {}
    this._properties = {}
    this._initShadowRoot()
    this._initProperties()
  }

  attributeChangedCallback(name) {
    this[this._setters[name]] = this[this._properties[name]]
  }

  get _template() {
    return getTemplateElement.call(this, this.tagName)
  }

  get _propertyTypes() {
    return getProperties.call(this, this.tagName)
  }

  _initShadowRoot() {
    const template = this._template
    if (!template) return

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  _initProperties() {
    const propertyTypes = this._propertyTypes
    if (!propertyTypes) return

    Object.entries(propertyTypes).forEach(([property, type]) => {
      const attribute = toKebabCase(property)
      this._registerSetter(property, attribute)
      this._registerProperty(property, attribute, type)
    })
  }

  _registerSetter(property, attribute) {
    this._setters[attribute] = `_${property}`
  }

  _registerProperty(property, attribute, type) {
    this._properties[attribute] = property
    switch (type) {
      case Boolean:
        this._defineBooleanProperty(property, attribute)
        break
      default:
        this._defineStringProperty(property, attribute)
    }
  }

  _defineStringProperty(property, attribute) {
    Object.defineProperty(this, property, {
      get() {
        return this.getAttribute(attribute)
      },
      set(value) {
        this.setAttribute(attribute, value)
      },
    })
  }

  _defineBooleanProperty(property, attribute) {
    Object.defineProperty(this, property, {
      get() {
        return this.hasAttribute(attribute)
      },
      set(value) {
        if (value) {
          this.setAttribute(attribute, '')
        } else {
          this.removeAttribute(attribute)
        }
      },
    })
  }
}

const getTemplateElement = memoize(function () {
  const styles = this.constructor.styles
  const template = this.constructor.template
  if (!styles && !template) {
    return null
  }
  const content = []
  if (styles) {
    content.push(`<style>${styles}</style>`)
  }
  if (template) {
    content.push(template)
  }
  const templateElement = document.createElement('template')
  templateElement.innerHTML = content.join('')
  return templateElement
})

const getProperties = memoize(function () {
  return this.constructor.properties
})

const toKebabCase = memoize(function (string) {
  return string.replace(/[A-Z]/g, '-$&').toLowerCase()
})

function memoize(fn) {
  const cache = {}
  return function (argument) {
    if (argument in cache) {
      return cache[argument]
    } else {
      return (cache[argument] = fn.call(this, argument))
    }
  }
}
