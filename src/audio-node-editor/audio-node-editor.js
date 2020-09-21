import useContextMenu from '../shared/base/use-context-menu.js'
import { defineCustomElement, html } from '../shared/core/element.js'

export default defineCustomElement('audio-node-editor', {
  template: html`
    <w-node-editor></w-node-editor>
    <w-menu>
      <w-menu-item>Oscillator</w-menu-item>
    </w-menu>
  `,
  setup({ host }) {
    const nodeEditor = /** @type {import('../shared/node-editor/node-editor.js').default} */ (host.shadowRoot.querySelector(
      'w-node-editor',
    ))
    const menu = /** @type {import('../shared/base/menu.js').default} */ (host.shadowRoot.querySelector(
      'w-menu',
    ))
    const oscillatorMenuItem = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-menu-item',
    ))

    useContextMenu(nodeEditor, menu)

    oscillatorMenuItem.addEventListener('click', (event) => {
      const oscillatorNode = /** @type {import('../shared/node-editor/graph-node.js').default} */ (document.createElement(
        'w-graph-node',
      ))
      oscillatorNode.textContent = 'Oscillator'

      // -2 is required for the cursor to click on the node
      // after adding it
      oscillatorNode.x = event.pageX - 2 - nodeEditor.panX
      oscillatorNode.y = event.pageY - 2 - nodeEditor.panY
      oscillatorNode.moving = true

      nodeEditor.appendChild(oscillatorNode)
    })
  },
})
