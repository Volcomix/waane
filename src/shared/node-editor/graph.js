import { html } from '../core/element.js'

const template = document.createElement('template')
template.innerHTML = html`
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <slot></slot>
`

export default class Graph extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('w-graph', Graph)
