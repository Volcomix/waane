import { WaaneElement, html } from '../waane-element.js'

class Input extends WaaneElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          margin-left: -12px;
          padding-left: 12px;
        }
      </style>

      <slot>Input</slot>
    `
  }
}

customElements.define('w-input', Input)
