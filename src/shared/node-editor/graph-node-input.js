import { css, defineCustomElement, html } from '../core/element.js'

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

    socket.addEventListener('mousemove', (event) => {
      if (!host.matches('w-node-editor[linking] w-graph-node-input')) {
        return
      }
      const graphNode = /** @type {import('./graph-node.js').default} */ (host.closest(
        'w-graph-node',
      ))
      event.stopPropagation()
      host.dispatchEvent(
        new CustomEvent('graph-link-end', {
          bubbles: true,
          detail: {
            x: graphNode.x,
            y: graphNode.y + socket.offsetTop + socket.offsetHeight / 2,
          },
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
