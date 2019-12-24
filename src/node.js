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

  constructor() {
    super()
    this._resizeObserver = new MutationObserver(this._dispatchResize.bind(this))
  }

  connectedCallback() {
    this._resizeObserver.observe(this, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    })
  }

  disconnectedCallback() {
    this._resizeObserver.disconnect()
  }

  get outputs() {
    return this.querySelectorAll('w-output')
  }

  get inputs() {
    return this.querySelectorAll('w-input')
  }

  set _x(x) {
    this.style.left = `${x}px`
  }

  set _y(y) {
    this.style.top = `${y}px`
  }

  _dispatchResize(mutations) {
    if (this._isResized(mutations)) {
      this.dispatchEvent(new Event('w-node-resize', { bubbles: true }))
    }
  }

  _isResized(mutations) {
    return mutations.some(mutation => {
      return mutation.target !== this || mutation.type !== 'attributes'
    })
  }
}

customElements.define('w-node', Node)
