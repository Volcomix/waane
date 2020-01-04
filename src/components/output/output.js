import { WaaneElement, html, css } from '../waane-element.js'

class Output extends WaaneElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: flex-end;
        margin-right: -12px;
        padding-right: 12px;
      }
    `
  }

  static get template() {
    return html`
      <slot>Output</slot>
    `
  }
}

customElements.define('w-output', Output)
