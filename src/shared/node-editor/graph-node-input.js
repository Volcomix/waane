import { css, defineCustomElement, html } from '../core/element.js'

let inputId = 0

export default defineCustomElement('w-graph-node-input', {
  styles: css`
    :host {
      display: flex;
      align-items: center;
    }

    w-graph-node-socket {
      position: absolute;
      left: 0px;
      transform: translateX(-50%);
      --socket-hover: var(--input-socket-hover);
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
    const socket = /** @type {import('./graph-node-socket.js').default} */ (host.shadowRoot.querySelector(
      'w-graph-node-socket',
    ))

    host.id = `input-${inputId++}`

    observe('disabled', () => {
      socket.disabled = host.disabled
    })

    socket.addEventListener('mousedown', (event) => {
      event.stopPropagation()
      if (host.matches('w-node-editor[linking] w-graph-node-input')) {
        return
      }
      host.dispatchEvent(
        new CustomEvent('graph-link-start', {
          bubbles: true,
          detail: { to: host.id },
        }),
      )
    })

    socket.addEventListener('mousemove', (event) => {
      if (!host.matches(`w-node-editor[linking='output'] w-graph-node-input`)) {
        return
      }
      event.stopPropagation()
      host.dispatchEvent(
        new CustomEvent('graph-link-end', {
          bubbles: true,
          detail: { to: host.id },
        }),
      )
    })

    socket.addEventListener('mouseup', (event) => {
      if (!host.matches(`w-node-editor[linking='output'] w-graph-node-input`)) {
        return
      }
      event.stopPropagation()
    })
  },
})
