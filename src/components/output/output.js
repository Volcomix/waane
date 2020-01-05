import { WaaneElement, html, css } from '../waane-element.js'

class Output extends WaaneElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: -12px;
      }

      :host::after {
        content: '';
        margin-left: 8px;
        margin-right: -4px;
        border-radius: 4px;
        width: 8px;
        height: 8px;
        background-color: rgb(var(--secondary));
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
