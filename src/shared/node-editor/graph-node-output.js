import { css, defineCustomElement, html } from '../core/element.js'

let outputId = 0

export default defineCustomElement('w-graph-node-output', {
  styles: css`
    :host {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    w-graph-node-socket {
      position: absolute;
      right: 0;
      transform: translateX(50%);
      --socket-pointer-events: var(--output-socket-pointer-events);
      --socket-opacity: var(--output-socket-opacity);
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
    const socket = /** @type {import('./graph-node-socket.js').default} */ (host.shadowRoot.querySelector(
      'w-graph-node-socket',
    ))

    host.id = `output-${outputId++}`

    observe('disabled', () => {
      socket.disabled = host.disabled
    })

    socket.addEventListener('mousedown', (event) => {
      event.stopPropagation()
      host.dispatchEvent(
        new CustomEvent('graph-link-start', {
          bubbles: true,
          detail: { from: host.id },
        }),
      )
    })

    socket.addEventListener('mousemove', (event) => {
      event.stopPropagation()
      host.dispatchEvent(
        new CustomEvent('graph-link-end', {
          bubbles: true,
          detail: { from: host.id },
        }),
      )
    })

    socket.addEventListener('mouseup', (event) => {
      event.stopPropagation()
    })
  },
})
