import { defineCustomElement, html } from '../shared/core/element.js'
import useMenuGraphNode from '../shared/node-editor/use-menu-graph-node.js'
import useMenuNodeEditor from '../shared/node-editor/use-menu-node-editor.js'

/**
 * @typedef {import('../shared/node-editor/node-editor.js').default} NodeEditor
 * @typedef {import('../shared/node-editor/graph-node.js').default} GraphNode
 * @typedef {import('../shared/base/menu.js').default} Menu
 * @typedef {import('../shared/base/menu-item.js').default} MenuItem
 */

export default defineCustomElement('audio-node-editor', {
  template: html`
    <w-node-editor></w-node-editor>
    <w-menu id="menu-node-editor">
      <w-menu-item>Oscillator</w-menu-item>
    </w-menu>
    <w-menu id="menu-graph-node">
      <w-menu-item>Delete</w-menu-item>
    </w-menu>
  `,
  setup({ host }) {
    const nodeEditor = /** @type {NodeEditor} */ (host.shadowRoot.querySelector(
      'w-node-editor',
    ))
    const menuNodeEditor = /** @type {Menu} */ (host.shadowRoot.querySelector(
      '#menu-node-editor',
    ))
    const menuGraphNode = /** @type {Menu} */ (host.shadowRoot.querySelector(
      '#menu-graph-node',
    ))
    const oscillatorMenuItem = /** @type {MenuItem} */ (host.shadowRoot.querySelector(
      'w-menu-item',
    ))

    // The order does matter because each one can stop the immediate
    // propagation to the next one
    useMenuGraphNode(nodeEditor, menuGraphNode)
    useMenuNodeEditor(nodeEditor, menuNodeEditor)

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
