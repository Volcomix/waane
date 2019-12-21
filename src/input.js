import { WaaneElement, html } from './waane-element.js'

class Input extends WaaneElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
        }
      </style>

      <slot>Input</slot>
    `
  }
}

customElements.define('w-input', Input)
