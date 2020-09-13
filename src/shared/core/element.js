export const html = String.raw

/**
 * @param {string} name
 * @param {string} template
 * @param {( arg: {
 *  host: HTMLElement
 *  connected(callback: () => void): void
 *  disconnected(callback: () => void): void
 * }) => void} [setup]
 */
export function defineCustomElement(name, template, setup) {
  const templateElement = document.createElement('template')
  templateElement.innerHTML = template

  customElements.define(
    name,
    class extends HTMLElement {
      constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(templateElement.content.cloneNode(true))

        setup &&
          setup({
            host: this,
            connected: (callback) => {
              this._connectedCallback = callback
            },
            disconnected: (callback) => {
              this._disconnectedCallback = callback
            },
          })
      }

      connectedCallback() {
        this._connectedCallback && this._connectedCallback()
      }

      disconnectedCallback() {
        this._disconnectedCallback && this._disconnectedCallback()
      }
    },
  )
}
