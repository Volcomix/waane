export const html = String.raw
export const css = String.raw

/**
 * @template T
 * @callback Observe
 * @param {keyof T} attributeName
 * @param {() => void} callback
 * @returns {void}
 */

/**
 * @template T
 * @typedef {object} SetupOptions
 * @property {HTMLElement & T} host
 * @property {Observe<T>} observe
 */

/**
 * @template T
 * @callback Setup
 * @param {SetupOptions<T>} options
 * @returns {void}
 */

/** @typedef {Object.<string, Number>} Properties */

/**
 * @template T
 * @param {string} name
 * @param {string} template
 * @param {Setup<T>} setup
 * @param {Properties} properties
 * @returns {HTMLElement & T}
 */
export function defineCustomElement(
  name,
  template,
  setup = () => {},
  properties = {},
) {
  const templateElement = document.createElement('template')
  templateElement.innerHTML = template

  class CustomElement extends HTMLElement {
    /** @type {Object.<string, () => void>} */
    _attributeChangedCallbacks = {}

    /** @this {CustomElement & T} */
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

  return /** @type {HTMLElement & T} */ (/** @type {unknown} */ (CustomElement))
}
