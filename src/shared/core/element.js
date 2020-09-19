export const html = String.raw
export const css = String.raw

/** @typedef {typeof Number | typeof Boolean} PropertyType */

/**
 * @template {PropertyType} T
 * @typedef {T extends typeof Number
 *  ? number
 *  : T extends typeof Boolean
 *  ? boolean
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
      this.setAttribute(attributeName, String(value))
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
  }
}

/** @typedef {Object.<string, PropertyType>} PropertyTypes */

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
  {
    styles = '',
    template = html`<slot></slot>`,
    properties = /** @type {T} */ ({}),
    setup = () => {},
  },
) {
  const templateElement = document.createElement('template')
  templateElement.innerHTML = html`
    <style>
      ${styles}
    </style>
    ${template}
  `

  const attributesByProperty = Object.keys(properties).reduce(
    (result, propertyName) =>
      Object.assign(result, {
        [propertyName]: propertyName.replace(/[A-Z]/g, '-$&').toLowerCase(),
      }),
    {},
  )

  const reflectedProperties = Object.entries(properties).reduce(
    (result, [propertyName, propertyType]) =>
      Object.assign(result, {
        [propertyName]: getProperty(
          attributesByProperty[propertyName],
          propertyType,
        ),
      }),
    {},
  )

  class CustomElement extends HTMLElement {
    _connectedCallback = () => {}
    _disconnectedCallback = () => {}

    /** @type {Object.<string, () => void>} */
    _attributeChangedCallbacks = Object.values(attributesByProperty).reduce(
      (callbacks, attributeName) =>
        Object.assign(callbacks, { [attributeName]: () => {} }),
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
          const attributeName = attributesByProperty[propertyName]
          this._attributeChangedCallbacks[attributeName] = callback
        }),
      })
    }

    static get observedAttributes() {
      return Object.values(attributesByProperty)
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
