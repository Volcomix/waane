import elevation from '../elevation/elevation.js'
import typography from '../typography/typography.js'
import { css, html, WaaneElement } from '../waane-element.js'

class Node extends WaaneElement {
  static get styles() {
    return css`
      :host {
        position: absolute;
        transition: border 100ms var(--easing-standard);
        border: 2px solid transparent;
        border-radius: 4px;
        padding: 6px 10px;
        background-color: rgba(var(--surface), var(--surface-opacity));
        ${elevation(3)}
      }

      :host([selected]) {
        border: 2px solid rgba(var(--primary), var(--high-emphasis));
      }

      .title {
        color: rgba(var(--on-surface), var(--high-emphasis));
        ${typography('subtitle2')}
      }

      .body {
        display: flex;
        flex-direction: column;
        color: rgba(var(--on-surface), var(--medium-emphasis));
        ${typography('body2')}
      }

      .body::slotted(*) {
        min-height: 28px;
      }
    `
  }

  static get template() {
    return html`
      <slot class="title" name="title">Node</slot>
      <slot class="body"></slot>
    `
  }

  static get properties() {
    return { x: String, y: String, selected: Boolean }
  }

  constructor() {
    super()
    this._resizeObserver = new MutationObserver(this._dispatchResize.bind(this))
    this.addEventListener('click', this._onClick.bind(this))
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
    return mutations.some((mutation) => {
      return mutation.target !== this || mutation.type !== 'attributes'
    })
  }

  _onClick(event) {
    if (event.ctrlKey || event.metaKey) {
      this.selected = !this.selected
      event.stopPropagation()
    } else if (event.target === this) {
      this.selected = true
    } else {
      event.stopPropagation()
      this.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )
    }
  }
}

customElements.define('w-node', Node)
