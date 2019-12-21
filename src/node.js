const template = document.createElement('template')
template.innerHTML = /* HTML */ `
  <style>
    :host {
      position: absolute;
      display: flex;
      flex-direction: column;
    }
  </style>

  <slot name="title">Node</slot>
  <slot></slot>
`

class Node extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  static get observedAttributes() {
    return ['x', 'y']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[`_update${name.toUpperCase()}`](newValue)
  }

  get x() {
    return this.getAttribute('x')
  }
  set x(x) {
    this.setAttribute('x', x)
  }

  get y() {
    return this.getAttribute('y')
  }
  set y(y) {
    this.setAttribute('y', y)
  }

  _updateX(x) {
    this.style.left = `${x}px`
  }

  _updateY(y) {
    this.style.top = `${y}px`
  }
}

customElements.define('w-node', Node)
