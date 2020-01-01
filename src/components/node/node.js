import { WaaneElement, html } from '../waane-element.js'

class Node extends WaaneElement {
  static get template() {
    return html`
      <style>
        @import '/components/typography/typography.css';
        @import '/components/elevation/elevation.css';

        :host {
          position: absolute;
          z-index: 1;
        }

        .node {
          display: flex;
          flex-direction: column;
          border-radius: 4px;
          padding: 16px;
          background-color: rgb(var(--surface));
        }

        .node__title {
          color: rgba(var(--on-surface), var(--high-emphasis));
        }

        .node__body {
          color: rgba(var(--on-surface), var(--medium-emphasis));
        }
      </style>

      <div class="node elevation--z1">
        <slot class="node__title typography--headline5" name="title">Node</slot>
        <slot class="node__body typography--body2"></slot>
      </div>
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
    this.style.left = x === null ? null : `${x}px`
  }

  set _y(y) {
    this.style.top = y === null ? null : `${y}px`
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
