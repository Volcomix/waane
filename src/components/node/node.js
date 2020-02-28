import { WaaneElement, html, css } from '../waane-element.js'
import elevation from '../elevation/elevation.js'
import typography from '../typography/typography.js'

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
    return { x: Number, y: Number, selected: Boolean }
  }

  constructor() {
    super()
    this._resizeObserver = new MutationObserver(this._dispatchResize.bind(this))
    this.addEventListener('mousedown', this._onMouseDown.bind(this))
    this.addEventListener('click', this._onMouseClick.bind(this))
    this.addEventListener('mousemove', this._onMouseMove.bind(this))
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
      this.dispatchEvent(
        new Event('w-node-resize', { bubbles: true, cancelable: true }),
      )
    }
  }

  _isResized(mutations) {
    return mutations.some(mutation => {
      return mutation.target !== this || mutation.type !== 'attributes'
    })
  }

  _onMouseDown(event) {
    if ((event.buttons & 1) === 0) {
      return
    }
    if (this.selected) {
      this._preventClick = false
      event.stopPropagation()
      return
    }
    this._preventClick = true
    if (event.ctrlKey || event.metaKey) {
      this.selected = true
      event.stopPropagation()
    } else if (event.target === this) {
      this.selected = true
    } else {
      event.stopPropagation()
      this.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          buttons: event.buttons,
        }),
      )
    }
  }

  _onMouseClick(event) {
    if (this._preventClick) {
      event.stopPropagation()
      return
    }
    if (!this.selected) {
      event.stopPropagation()
      return
    }
    if (event.ctrlKey || event.metaKey) {
      this.selected = false
      event.stopPropagation()
    } else if (event.target !== this) {
      event.stopPropagation()
      this.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          button: event.button,
          buttons: event.buttons,
        }),
      )
    }
  }

  _onMouseMove(event) {
    if (['input', 'select'].includes(event.target.tagName.toLowerCase())) {
      event.stopPropagation()
    }
  }
}

customElements.define('w-node', Node)
