import { css, defineCustomElement, html } from '../core/element.js'

let outputId = 0

export default defineCustomElement('w-graph-node-output', {
  styles: css`
    :host {
      justify-content: flex-end;
    }

    w-graph-node-socket {
      position: absolute;
      right: 0;
      transform: translateX(50%);
      --graph-node-socket-hover: var(--graph-node-output-hover);
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

    host.id = `output-${outputId++}`

    socket.addEventListener('mousedown', (event) => {
      event.stopPropagation()
      if (host.matches('w-node-editor[linking] w-graph-node-output')) {
        return
      }
      host.dispatchEvent(
        new CustomEvent('graph-link-start', {
          bubbles: true,
          detail: { from: host.id },
        }),
      )
    })

    socket.addEventListener('mousemove', (event) => {
      if (!host.matches(`w-node-editor[linking='input'] w-graph-node-output`)) {
        return
      }
      event.stopPropagation()
      host.dispatchEvent(
        new CustomEvent('graph-link-end', {
          bubbles: true,
          detail: { from: host.id },
        }),
      )
    })

    socket.addEventListener('mouseup', (event) => {
      if (!host.matches(`w-node-editor[linking='input'] w-graph-node-output`)) {
        return
      }
      event.stopPropagation()
    })
  },
})
