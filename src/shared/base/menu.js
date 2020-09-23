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

    ::slotted(hr) {
      margin: 8px 0;
      border: none;
      border-top: 1px solid rgba(var(--color-on-surface) / 0.12);
    }
  `,
  properties: {
    open: Boolean,
    x: Number,
    y: Number,
  },
  setup({ host, observe }) {
    let width = 0
    let height = 0

    function close() {
      document.body.removeEventListener('mousedown', handleBodyMouseDown)
      host.open = false
    }

    /**
     * @param {MouseEvent} event
     */
    function handleBodyMouseDown(event) {
      if (event.composedPath().includes(host)) {
        return
      }
      close()
    }

    host.addEventListener('click', () => {
      close()
    })

    observe('open', () => {
      document.body.addEventListener('mousedown', handleBodyMouseDown)
      if (host.open) {
        const boundingClientRect = host.getBoundingClientRect()
        width = boundingClientRect.width
        height = boundingClientRect.height
      }
    })

    observe('x', () => {
      const x = Math.min(host.x, document.documentElement.clientWidth - width)
      host.style.left = `${x}px`
    })

    observe('y', () => {
      const y = Math.min(host.y, document.documentElement.clientHeight - height)
      host.style.top = `${y}px`
    })
  },
})
