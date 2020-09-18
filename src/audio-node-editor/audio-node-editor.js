import { defineCustomElement, html } from '../shared/core/element.js'

export default defineCustomElement('audio-node-editor', {
  template: html`
    <w-context-menu>
      <w-graph></w-graph>
      <w-menu>
        <w-menu-item>Oscillator</w-menu-item>
      </w-menu>
    </w-context-menu>
  `,
  setup({ host }) {
    const graph = host.shadowRoot.querySelector('w-graph')
    const oscillatorMenuItem = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-menu-item',
    ))

    oscillatorMenuItem.addEventListener('click', (event) => {
      const oscillatorNode = /** @type {import('../shared/node-editor/graph-node.js').default} */ (document.createElement(
        'w-graph-node',
      ))
      oscillatorNode.textContent = 'Oscillator'
      oscillatorNode.x = event.pageX
      oscillatorNode.y = event.pageY
      graph.appendChild(oscillatorNode)
    })
  },
})
