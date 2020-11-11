import { css, defineCustomElement, html } from '../core/element.js'
import { nextId } from '../helpers/id.js'

/**
 * @typedef {import('./graph-node-socket.js').default} GraphNodeSocket
 */

export default defineCustomElement('w-graph-node-input', {
  styles: css`
    :host {
      display: flex;
      align-items: center;
    }

    w-graph-node-socket {
      position: absolute;
      left: 0;
      transform: translateX(-50%);
      --socket-pointer-events: var(--input-socket-pointer-events);
      --socket-opacity: var(--input-socket-opacity);
    }
  `,
  template: html`
    <slot></slot>
    <w-graph-node-socket></w-graph-node-socket>
  `,
  properties: {
    disabled: Boolean,
    type: String,
  },
  setup({ host, observe }) {
    const socket = /** @type {GraphNodeSocket} */ (host.shadowRoot.querySelector('w-graph-node-socket'))

    host.id = `input-${nextId('input')}`

    observe('disabled', () => {
      socket.disabled = host.disabled
    })

    socket.addEventListener('mousedown', (event) => {
      event.stopPropagation()
      host.dispatchEvent(
        new CustomEvent('graph-link-start', {
          bubbles: true,
          detail: { to: host.id },
        }),
      )
    })

    socket.addEventListener('mousemove', (event) => {
      event.stopPropagation()
      host.dispatchEvent(
        new CustomEvent('graph-link-end', {
          bubbles: true,
          detail: { to: host.id },
        }),
      )
    })

    socket.addEventListener('mouseup', (event) => {
      event.stopPropagation()
    })
  },
})
