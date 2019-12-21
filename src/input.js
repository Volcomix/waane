const template = document.createElement('template')
template.innerHTML = /* HTML */ `
  <style>
    :host {
      display: flex;
    }
  </style>

  <slot>Input</slot>
`

class Input extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('w-input', Input)
