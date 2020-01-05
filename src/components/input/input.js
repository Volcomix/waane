import { WaaneElement, html, css } from '../waane-element.js'

class Input extends WaaneElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        margin-left: -12px;
      }

      :host::before {
        content: '';
        margin-left: -4px;
        margin-right: 8px;
        border-radius: 4px;
        width: 8px;
        height: 8px;
        background-color: rgb(var(--secondary));
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
