const template = document.createElement('template')
template.innerHTML = /* HTML */ `
  <style>
    :host {
      display: flex;
      justify-content: flex-end;
    }
  </style>

  <slot>Output</slot>
`

class Output extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('w-output', Output)
