import { WaaneElement, html } from './waane-element.js'

class Output extends WaaneElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          justify-content: flex-end;
        }
      </style>

      <slot>Output</slot>
    `
  }
}

customElements.define('w-output', Output)
