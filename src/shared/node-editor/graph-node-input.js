import { css, defineCustomElement, html } from '../core/element.js'

let inputId = 0

export default defineCustomElement('w-graph-node-input', {
  styles: css`
    w-graph-node-socket {
      position: absolute;
      left: 0px;
      transform: translateX(-50%);
    }
  `,
  template: html`
    <slot></slot>
    <w-graph-node-socket></w-graph-node-socket>
  `,
  setup({ host }) {
    const socket = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-graph-node-socket',
    ))

    host.id = `input-${inputId++}`

    socket.addEventListener('mousemove', (event) => {
      if (!host.matches('w-node-editor[linking] w-graph-node-input')) {
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
      if (!host.matches('w-node-editor[linking] w-graph-node-input')) {
        return
      }
      event.stopPropagation()
    })
  },
})