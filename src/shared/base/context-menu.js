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

    this.addEventListener('contextmenu', this._onContextMenu)
  }

  connectedCallback() {
    document.body.addEventListener('click', this._onBodyClick)
  }

  disconnectedCallback() {
    document.body.removeEventListener('click', this._onBodyClick)
  }

  /**
   * @param {MouseEvent} event
   */
  _onContextMenu = (event) => {
    event.preventDefault()
    this._menu.hidden = false
  }

  _onBodyClick = () => {
    this._menu.hidden = true
  }
}

customElements.define('w-context-menu', ContextMenu)
