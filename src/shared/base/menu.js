import { css, html } from '../core/element.js'
import elevation from '../core/elevation.js'

const style = css`
  :host {
    min-width: 112px;
    padding: 8px 0;
    border-radius: 4px;
    background-color: rgb(var(--color-surface));
    color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    ${elevation(8)}
  }
`

const template = document.createElement('template')
template.innerHTML = html`
  <style>
    ${style}
  </style>
  <slot></slot>
`

export default class Menu extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('w-menu', Menu)
