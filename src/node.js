import { WaaneElement, html } from './waane-element.js'

class Node extends WaaneElement {
  static get template() {
    return html`
      <style>
        :host {
          position: absolute;
          display: flex;
          flex-direction: column;
        }
      </style>

      <slot name="title">Node</slot>
      <slot></slot>
    `
  }

  static get observedAttributes() {
    return ['x', 'y']
  }

  set _x(x) {
    this.style.left = `${x}px`
  }

  set _y(y) {
    this.style.top = `${y}px`
  }
}

customElements.define('w-node', Node)
