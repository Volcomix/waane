import { css, html } from '../core/element.js'
import elevation from '../core/elevation.js'
import typography from '../core/typography.js'

const style = css`
  :host {
    position: absolute;
    padding: 16px;
    border-radius: 4px;
    background-color: rgb(var(--color-surface));
    color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    ${elevation(1)}
  }

  slot {
    display: flex;
    align-items: center;
    height: 32px;
    ${typography('headline6')}
  }
`

const template = document.createElement('template')
template.innerHTML = html`
  <style>
    ${style}
  </style>
  <slot></slot>
`

export default class GraphNode extends HTMLElement {
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

  /**
   * @param {string} name
   */
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
