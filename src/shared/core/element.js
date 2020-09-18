export const html = String.raw
export const css = String.raw

/** @typedef {typeof Number | typeof Boolean} PropertyType */

/**
 * @param {string} attributeName
 */
function getNumberProperty(attributeName) {
  return {
    /** @this {HTMLElement} */
    get() {
      return Number(this.getAttribute(attributeName))
    },

    /**
     * @param {number} value
     * @this {HTMLElement}
     */
    set(value) {
      this.setAttribute(attributeName, String(value))
    },
  }
}

/**
 * @param {string} attributeName
 */
function getBooleanProperty(attributeName) {
  return {
    /** @this {HTMLElement} */
    get() {
      return this.hasAttribute(attributeName)
    },

    /**
     * @param {boolean} value
     * @this {HTMLElement}
     */
    set(value) {
      if (value) {
        this.setAttribute(attributeName, '')
      } else {
        this.removeAttribute(attributeName)
      }
    },
  }
}

/**
 * @param {string} propertyName
 * @param {PropertyType} propertyType
 */
function getProperty(propertyName, propertyType) {
  const attributeName = propertyName.replace(/[A-Z]/g, '-$&').toLowerCase()
  switch (propertyType) {
    case Number:
      return getNumberProperty(attributeName)
    case Boolean:
      return getBooleanProperty(attributeName)
  }
}

/** @typedef {Object.<string, PropertyType} PropertyTypes */

/**
 * @template {PropertyTypes} T
 * @typedef {{[P in keyof T]: InstanceType<T[P]>}} Properties
 */

/**
 * @template T
 * @callback Observe
 * @param {keyof T} propertyName
 * @param {() => void} callback
 * @returns {void}
 */

/**
 * @template {PropertyTypes} T
 * @typedef {object} SetupOptions
 * @property {HTMLElement & Properties<T>} host
 * @property {(callback: () => void) => void} connected
 * @property {(callback: () => void) => void} disconnected
 * @property {Observe<T>} observe
 */

/**
 * @template T
 * @callback Setup
 * @param {SetupOptions<T>} options
 * @returns {void}
 */

/**
 * @template {PropertyTypes} T
 * @typedef {object} DefineCustomElementOptions
 * @property {string} [template]
 * @property {T} [properties]
 * @property {Setup<T>} [setup]
 */

/**
 * @template {PropertyTypes} T
 * @param {string} name
 * @param {DefineCustomElementOptions<T>} options
 * @returns {HTMLElement & Properties<T>}
 */
export function defineCustomElement(
  name,
  { template = '', properties = /** @type {T} */ ({}), setup = () => {} },
) {
  const templateElement = document.createElement('template')
  templateElement.innerHTML = template

  const reflectedProperties = Object.entries(properties).reduce(
    (result, [propertyName, propertyType]) =>
      Object.assign(result, {
        [propertyName]: getProperty(propertyName, propertyType),
      }),
    {},
  )

  class CustomElement extends HTMLElement {
    _connectedCallback = () => {}
    _disconnectedCallback = () => {}

    /** @type {Object.<string, () => void>} */
    _attributeChangedCallbacks = Object.keys(properties).reduce(
      (callbacks, propertyName) =>
        Object.assign(callbacks, { [propertyName]: () => {} }),
      {},
    )

    /** @this {CustomElement & Properties<T>} */
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(templateElement.content.cloneNode(true))

      Object.defineProperties(this, reflectedProperties)

      setup({
        host: this,
        connected: (callback) => {
          this._connectedCallback = callback
        },
        disconnected: (callback) => {
          this._disconnectedCallback = callback
        },
        observe: /** @type {Observe<T>} */ ((
          /** @type {string} */ propertyName,
          callback,
        ) => {
          this._attributeChangedCallbacks[propertyName] = callback
        }),
      })
    }

    static get observedAttributes() {
      return Object.keys(properties)
    }

    connectedCallback() {
      this._connectedCallback()
    }

    disconnectedCallback() {
      this._disconnectedCallback()
    }

    /**
     * @param {string} name
     */
    attributeChangedCallback(name) {
      this._attributeChangedCallbacks[name]()
    }
  }

  customElements.define(name, CustomElement)

  return /** @type {HTMLElement & Properties<T>} */ (
    /** @type {unknown} */ (CustomElement)
  )
}
