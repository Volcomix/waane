const template = document.createElement('template')
template.innerHTML = /* HTML */ `
  <slot name="title">Node</slot>
  <slot></slot>
`

class Node extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('w-node', Node)
