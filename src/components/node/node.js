import { WaaneElement, html } from '../waane-element.js'
import elevation from '../elevation/elevation.js'
import typography from '../typography/typography.js'

class Node extends WaaneElement {
  static get template() {
    const styles = [
      elevation(':host', 1),
      typography('.title', 'subtitle2'),
      typography('.body', 'body2'),
    ]
    return html`
      ${styles.join('\n')}
      <style>
        :host {
          position: absolute;
          z-index: 1;
          border-radius: 4px;
          padding: 8px 12px;
          background-color: rgb(var(--surface));
        }

        .title {
          color: rgba(var(--on-surface), var(--high-emphasis));
        }

        .body {
          display: flex;
          flex-direction: column;
          margin-top: 8px;
          color: rgba(var(--on-surface), var(--medium-emphasis));
        }
      </style>

      <slot class="title" name="title">Node</slot>
      <slot class="body"></slot>
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
