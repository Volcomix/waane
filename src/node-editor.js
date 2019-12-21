import { WaaneElement, html } from './waane-element.js'

class NodeEditor extends WaaneElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <slot></slot>
    `
  }
}

customElements.define('w-node-editor', NodeEditor)
