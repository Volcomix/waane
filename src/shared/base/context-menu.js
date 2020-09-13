import { html } from '../../helpers/template.js'

const template = document.createElement('template')
template.innerHTML = html`<slot></slot>`

class ContextMenu extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._menu = /** @type {HTMLElement} */ (this.querySelector('w-menu'))
    this._menu.hidden = true

    this.addEventListener('contextmenu', () => {
      this._menu.hidden = false
    })
  }

  connectedCallback() {
    document.body.addEventListener('click', this._closeMenu)
  }

  disconnectedCallback() {
    document.body.removeEventListener('click', this._closeMenu)
  }

  _closeMenu = () => {
    this._menu.hidden = true
  }
}

customElements.define('w-context-menu', ContextMenu)
