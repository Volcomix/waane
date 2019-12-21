const template = document.createElement('template')
template.innerHTML = /* HTML */ `
  <slot>Right click to add a node</slot>
`

class NodeEditor extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('w-node-editor', NodeEditor)
