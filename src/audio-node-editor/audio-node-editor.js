import { defineCustomElement, html } from '../shared/core/element.js'
import useGraphNodeMenu from '../shared/node-editor/use-graph-node-menu.js'
import useNodeEditorMenu from '../shared/node-editor/use-node-editor-menu.js'

/**
 * @typedef {import('../shared/node-editor/node-editor.js').default} NodeEditor
 * @typedef {import('../shared/node-editor/graph-node.js').default} GraphNode
 * @typedef {import('../shared/base/menu.js').default} Menu
 * @typedef {import('../shared/base/menu-item.js').default} MenuItem
 */

export default defineCustomElement('audio-node-editor', {
  template: html`
    <w-node-editor></w-node-editor>
    <w-menu id="node-editor-menu">
      <w-menu-item>Oscillator</w-menu-item>
    </w-menu>
    <w-menu id="graph-node-menu">
      <w-menu-item>Delete</w-menu-item>
    </w-menu>
  `,
  setup({ host }) {
    const nodeEditor = /** @type {NodeEditor} */ (host.shadowRoot.querySelector(
      'w-node-editor',
    ))
    const nodeEditorMenu = /** @type {Menu} */ (host.shadowRoot.querySelector(
      '#node-editor-menu',
    ))
    const graphNodeMenu = /** @type {Menu} */ (host.shadowRoot.querySelector(
      '#graph-node-menu',
    ))
    const oscillatorMenuItem = /** @type {MenuItem} */ (host.shadowRoot.querySelector(
      'w-menu-item',
    ))

    // The order does matter because each one can stop the immediate
    // propagation to the next one
    useGraphNodeMenu(nodeEditor, graphNodeMenu)
    useNodeEditorMenu(nodeEditor, nodeEditorMenu)

    oscillatorMenuItem.addEventListener('click', (event) => {
      const oscillatorNode = /** @type {GraphNode} */ (document.createElement(
        'w-graph-node',
      ))
      oscillatorNode.textContent = 'Oscillator'

      // -2 is required for the cursor to click on the node
      // after adding it
      const { width, height } = nodeEditor.getBoundingClientRect()
      oscillatorNode.x =
        (event.pageX - 2 - width / 2) / nodeEditor.zoom - nodeEditor.panX
      oscillatorNode.y =
        (event.pageY - 2 - height / 2) / nodeEditor.zoom - nodeEditor.panY
      oscillatorNode.moving = true

      nodeEditor.appendChild(oscillatorNode)
    })
  },
})
