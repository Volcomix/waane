import { css, defineCustomElement, html } from '../core/element.js'

export default defineCustomElement('w-graph-node-output', {
  styles: css`
    :host {
      justify-content: flex-end;
    }

    w-graph-node-socket {
      position: absolute;
      right: 0;
      transform: translateX(50%);
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

    socket.addEventListener('mousedown', (event) => {
      const graphNode = /** @type {import('./graph-node.js').default} */ (host.closest(
        'w-graph-node',
      ))
      event.stopPropagation()
      host.dispatchEvent(
        new CustomEvent('graph-link-start', {
          bubbles: true,
          detail: {
            x: graphNode.x + graphNode.offsetWidth,
            y: graphNode.y + socket.offsetTop + socket.offsetHeight / 2,
          },
        }),
      )
    })
  },
})
