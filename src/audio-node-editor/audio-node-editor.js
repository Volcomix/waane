import { defineCustomElement, html } from '../shared/core/element.js'
import useSelection from '../shared/core/use-selection.js'

/** @typedef {import('../shared/node-editor/graph-node.js').default} GraphNode */

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
    const graph = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-graph',
    ))
    const oscillatorMenuItem = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-menu-item',
    ))

    useSelection(graph, 'w-graph-node')

    oscillatorMenuItem.addEventListener('click', (event) => {
      const oscillatorNode = /** @type {GraphNode} */ (document.createElement(
        'w-graph-node',
      ))
      oscillatorNode.textContent = 'Oscillator'
      oscillatorNode.x = event.pageX
      oscillatorNode.y = event.pageY
      graph.appendChild(oscillatorNode)
    })
  },
})
