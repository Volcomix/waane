import { WaaneElement, html, css } from '../waane-element.js'

class Input extends WaaneElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        margin-left: -12px;
        padding-left: 12px;
      }
    `
  }

  static get template() {
    return html`
      <slot>Input</slot>
    `
  }
}

customElements.define('w-input', Input)
