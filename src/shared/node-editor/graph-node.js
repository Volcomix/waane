import { html } from '../core/element.js'

const template = document.createElement('template')
template.innerHTML = html`
  <style>
    :host {
      position: absolute;
    }
  </style>
  <slot></slot>
`

export class GraphNode extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  static get observedAttributes() {
    return ['x', 'y']
  }

  get x() {
    return Number(this.getAttribute('x'))
  }

  set x(x) {
    this.setAttribute('x', String(x))
  }

  get y() {
    return Number(this.getAttribute('y'))
  }

  set y(y) {
    this.setAttribute('y', String(y))
  }

  attributeChangedCallback(name) {
    switch (name) {
      case 'x':
        this.style.left = `${this.x}px`
        break
      case 'y':
        this.style.top = `${this.y}px`
        break
    }
  }
}

customElements.define('w-graph-node', GraphNode)
