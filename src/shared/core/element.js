export const html = String.raw
export const css = String.raw

/** @typedef {Object.<string, typeof Number>} PropertiesTypes */

/**
 * @template {PropertiesTypes} T
 * @typedef {{[P in keyof T]: InstanceType<T[P]>}} Properties
 */

/**
 * @template T
 * @callback Observe
 * @param {keyof T} attributeName
 * @param {() => void} callback
 * @returns {void}
 */

/**
 * @template {PropertiesTypes} T
 * @typedef {object} SetupOptions
 * @property {HTMLElement & Properties<T>} host
 * @property {Observe<T>} observe
 */

/**
 * @template T
 * @callback Setup
 * @param {SetupOptions<T>} options
 * @returns {void}
 */

/**
 * @template {PropertiesTypes} T
 * @param {string} name
 * @param {string} template
 * @param {Setup<T>} setup
 * @param {T} properties
 * @returns {HTMLElement & Properties<T>}
 */
export function defineCustomElement(
  name,
  template,
  setup = () => {},
  properties = /** @type {T} */ ({}),
) {
  const templateElement = document.createElement('template')
  templateElement.innerHTML = template

  class CustomElement extends HTMLElement {
    /** @type {Object.<string, () => void>} */
    _attributeChangedCallbacks = {}

    /** @this {CustomElement & Properties<T>} */
    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(templateElement.content.cloneNode(true))

      setup({
        host: this,
        observe: /** @type {Observe<T>} */ ((
          /** @type {string} */ attributeName,
          callback,
        ) => {
          Object.defineProperty(this, attributeName, {
            get: () => Number(this.getAttribute(attributeName)),
            set: (value) => this.setAttribute(attributeName, String(value)),
          })
          this._attributeChangedCallbacks[attributeName] = callback
        }),
      })
    }

    static get observedAttributes() {
      return Object.keys(properties)
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
