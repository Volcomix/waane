import { html } from '../core/element.js'

const template = document.createElement('template')
template.innerHTML = html`
  <style>
    :host {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 16px;
      cursor: pointer;
      user-select: none;
      transition: background-color 100ms var(--easing-standard);
    }

    :host(:hover) {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    :host(:active) {
      background-color: rgba(var(--color-on-surface) / 0.16);
    }
  </style>
  <slot></slot>
`

export default class MenuItem extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('w-menu-item', MenuItem)
