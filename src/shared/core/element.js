/**
 * Alias for String.raw
 * Use it along with VS Code extension lit-html
 * to get template syntax highlighting.
 *
 * See https://marketplace.visualstudio.com/items?itemName=bierner.lit-html
 */
export const html = String.raw

/**
 * Alias for String.raw
 * Use it along with VS Code extension vscode-styled-components
 * to get styles syntax highlighting.
 *
 * See https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components
 */
export const css = String.raw

/** @typedef {typeof String | typeof Number | typeof Boolean} PropertyType */

/**
 * @template {PropertyType} T
 * @typedef {T extends typeof Number
 *  ? number
 *  : T extends typeof Boolean
 *  ? boolean
 *  : T extends typeof String
 *  ? string
 *  : never
 * } PrimitiveType
 */

/**
 * @template T
 * @typedef {object} AccessorProperty
 * @property {() => T} get
 * @property {(value: T) => void} set
 */

/**
 * @param {string} attributeName
 * @returns {AccessorProperty<string>}
 */
function getStringProperty(attributeName) {
  return {
    /** @this {HTMLElement} */
    get() {
      return this.getAttribute(attributeName)
    },

    /** @this {HTMLElement} */
    set(value) {
      if (value === null) {
        this.removeAttribute(attributeName)
      } else {
        this.setAttribute(attributeName, value)
      }
    },
  }
}

/**
 * @param {string} attributeName
 * @returns {AccessorProperty<number>}
 */
function getNumberProperty(attributeName) {
  return {
    /** @this {HTMLElement} */
    get() {
      return Number(this.getAttribute(attributeName))
    },

    /** @this {HTMLElement} */
    set(value) {
      if (value === null) {
        this.removeAttribute(attributeName)
      } else {
        this.setAttribute(attributeName, String(value))
      }
    },
  }
}

/**
 * @param {string} attributeName
 * @returns {AccessorProperty<boolean>}
 */
function getBooleanProperty(attributeName) {
  return {
    /** @this {HTMLElement} */
    get() {
      return this.hasAttribute(attributeName)
    },

    /** @this {HTMLElement} */
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
 * @param {string} attributeName
 * @param {PropertyType} propertyType
 * @returns {AccessorProperty<PrimitiveType<PropertyType>>}
 */
function getProperty(attributeName, propertyType) {
  switch (propertyType) {
    case Number:
      return getNumberProperty(attributeName)
    case Boolean:
      return getBooleanProperty(attributeName)
    default:
      return getStringProperty(attributeName)
  }
}

/** @typedef {Object<string, PropertyType>} PropertyTypes */

/**
 * @template {PropertyTypes} T
 * @typedef {{[P in keyof T]: PrimitiveType<T[P]>}} Properties
 */

/**
 * @template {PropertyTypes} T
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
 * @template {PropertyTypes} T
 * @callback Setup
 * @param {SetupOptions<T>} options
 * @returns {void}
 */

/**
 * @template {PropertyTypes} T
 * @typedef {object} DefineCustomElementOptions
 * @property {string} [styles]
 * @property {string} [template]
 * @property {boolean} [shadow]
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
  { styles, template = html`<slot></slot>`, shadow = true, properties = /** @type {T} */ ({}), setup = () => {} },
) {
  const templateElement = document.createElement('template')
  templateElement.innerHTML = styles
    ? html`
        <style>
          ${styles}
        </style>
        ${template}
      `
    : template

  /** @type {Object<string, string>} */
  const attributesByProperty = Object.keys(properties).reduce(
    (result, propertyName) =>
      Object.assign(result, {
        [propertyName]: (
          propertyName.substring(0, 1) + propertyName.substring(1).replace(/[A-Z]/g, '-$&')
        ).toLowerCase(),
      }),
    {},
  )

  const reflectedProperties = Object.entries(properties).reduce(
    (result, [propertyName, propertyType]) =>
      Object.assign(result, {
        [propertyName]: getProperty(attributesByProperty[propertyName], propertyType),
      }),
    {},
  )

  class CustomElement extends HTMLElement {
    _connectedCallback = () => {}
    _disconnectedCallback = () => {}

    /** @type {Object<string, () => void>} */
    _attributeChangedCallbacks = Object.values(attributesByProperty).reduce(
      (callbacks, attributeName) => Object.assign(callbacks, { [attributeName]: () => {} }),
      {},
    )

    /** @this {CustomElement & Properties<T>} */
    constructor() {
      super()

      if (shadow) {
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(templateElement.content.cloneNode(true))
      }

      const propertiesBackup = Object.keys(reflectedProperties).reduce(
        (result, propertyName) =>
          this[propertyName] === undefined ? result : Object.assign(result, { [propertyName]: this[propertyName] }),
        /** @type {Properties<T>} */ ({}),
      )

      Object.defineProperties(this, reflectedProperties)

      setup({
        host: this,
        connected: (callback) => {
          this._connectedCallback = callback
        },
        disconnected: (callback) => {
          this._disconnectedCallback = callback
        },
        observe: /** @type {Observe<T>} */ ((/** @type {string} */ propertyName, callback) => {
          const attributeName = attributesByProperty[propertyName]
          this._attributeChangedCallbacks[attributeName] = callback
        }),
      })

      Object.entries(propertiesBackup).forEach(([propertyName, value]) => {
        this[/** @type {keyof T} */ (propertyName)] = value
        const attributeName = attributesByProperty[propertyName]
        this._attributeChangedCallbacks[attributeName]()
      })
    }

    static get observedAttributes() {
      return Object.values(attributesByProperty)
    }

    connectedCallback() {
      if (!shadow) {
        this.appendChild(templateElement.content.cloneNode(true))
      }
      this._connectedCallback()
    }

    disconnectedCallback() {
      this._disconnectedCallback()
    }

    /**
     * @template {PropertyType} T
     * @param {string} name
     * @param {PrimitiveType<T>} oldValue
     * @param {PrimitiveType<T>} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue !== oldValue) {
        this._attributeChangedCallbacks[name]()
      }
    }
  }

  customElements.define(name, CustomElement)

  return /** @type {HTMLElement & Properties<T>} */ (/** @type {unknown} */ (CustomElement))
}
