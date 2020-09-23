import { css, defineCustomElement } from '../core/element.js'
import elevation from '../core/elevation.js'

export default defineCustomElement('w-menu', {
  styles: css`
    :host {
      position: fixed;
      min-width: 112px;
      padding: 8px 0;
      border-radius: 4px;
      background-color: rgb(var(--color-surface));
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
      ${elevation(8)}
    }

    :host(:not([open])) {
      display: none;
    }
  `,
  properties: {
    open: Boolean,
    x: Number,
    y: Number,
  },
  setup({ host, observe }) {
    function close() {
      document.body.removeEventListener('mousedown', onBodyMouseDown)
      host.open = false
    }

    /**
     * @param {MouseEvent} event
     */
    function onBodyMouseDown(event) {
      if (event.composedPath().includes(host)) {
        return
      }
      close()
    }

    host.addEventListener('click', () => {
      close()
    })

    observe('open', () => {
      document.body.addEventListener('mousedown', onBodyMouseDown)
    })

    observe('x', () => {
      host.style.left = `${host.x}px`
    })

    observe('y', () => {
      host.style.top = `${host.y}px`
    })
  },
})
