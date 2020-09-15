import { html } from '../core/element.js'

const template = document.createElement('template')
template.innerHTML = html`
  <style>
    ::slotted(w-menu) {
      position: fixed;
    }
  </style>
  <slot></slot>
`

export default class ContextMenu extends HTMLElement {
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
  _onContextMenu(event) {
    event.preventDefault()
    this._menu.hidden = false
    this._setMenuPosition(event)
  }

  _onBodyClick = () => {
    this._menu.hidden = true
  }

  /**
   * @param {MouseEvent} event
   */
  _setMenuPosition(event) {
    const { width, height } = this._menu.getBoundingClientRect()
    const x = Math.min(
      event.clientX,
      document.documentElement.clientWidth - width,
    )
    const y = Math.min(
      event.clientY,
      document.documentElement.clientHeight - height,
    )
    this._menu.style.left = `${x}px`
    this._menu.style.top = `${y}px`
  }
}

customElements.define('w-context-menu', ContextMenu)
