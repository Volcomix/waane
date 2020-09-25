import { defineCustomElement, html } from '../shared/core/element.js'
import { squaredDist } from '../shared/helpers/geometry.js'
import useGraphNodeMenu from './use-graph-node-menu.js'
import useNodeEditorMenu from './use-node-editor-menu.js'

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
      <w-menu-item id="oscillator">Oscillator</w-menu-item>
      <w-menu-item id="audio-destination">Audio destination</w-menu-item>
    </w-menu>
    <w-menu id="graph-node-menu">
      <w-menu-item id="duplicate">
        <w-icon>content_copy</w-icon>
        <span>Duplicate</span>
      </w-menu-item>
      <hr />
      <w-menu-item id="delete">
        <w-icon>delete</w-icon>
        <span>Delete</span>
      </w-menu-item>
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
    const nodeEditorMenuItemOscillator = /** @type {MenuItem} */ (nodeEditorMenu.querySelector(
      '#oscillator',
    ))
    const nodeEditorMenuItemAudioDestination = /** @type {MenuItem} */ (nodeEditorMenu.querySelector(
      '#audio-destination',
    ))
    const graphNodeMenuItemDuplicate = /** @type {MenuItem} */ (graphNodeMenu.querySelector(
      '#duplicate',
    ))
    const graphNodeMenuItemDelete = /** @type {MenuItem} */ (graphNodeMenu.querySelector(
      '#delete',
    ))

    // The order does matter because each one can stop the immediate
    // propagation to the next one
    useGraphNodeMenu(nodeEditor, graphNodeMenu)
    useNodeEditorMenu(nodeEditor, nodeEditorMenu)

    function cancelMovingGraphNodes() {
      nodeEditor.querySelectorAll('w-graph-node[moving]').forEach((
        /** @type {GraphNode} */ movingGraphNode,
      ) => {
        movingGraphNode.moving = false
      })
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    function toNodeEditorPosition(x, y) {
      const { width, height } = nodeEditor.getBoundingClientRect()
      return {
        x: (x - width / 2) / nodeEditor.zoom - nodeEditor.panX,
        y: (y - height / 2) / nodeEditor.zoom - nodeEditor.panY,
      }
    }

    /**
     * @param {MouseEvent} event
     * @param {string} audioNodeName
     */
    function addAudioNode(event, audioNodeName) {
      cancelMovingGraphNodes()

      const { x, y } = toNodeEditorPosition(event.pageX, event.pageY)

      const oscillatorNode = /** @type {GraphNode} */ (document.createElement(
        'w-graph-node',
      ))
      oscillatorNode.textContent = audioNodeName
      oscillatorNode.x = x
      oscillatorNode.y = y
      oscillatorNode.moving = true
      nodeEditor.appendChild(oscillatorNode)
    }

    nodeEditorMenuItemOscillator.addEventListener('click', (event) => {
      addAudioNode(event, 'Oscillator')
    })

    nodeEditorMenuItemAudioDestination.addEventListener('click', (event) => {
      addAudioNode(event, 'Audio destination')
    })

    graphNodeMenuItemDuplicate.addEventListener('click', (event) => {
      cancelMovingGraphNodes()

      const mousePosition = toNodeEditorPosition(event.pageX, event.pageY)

      const offsetX = (event.clientX - graphNodeMenu.x) / nodeEditor.zoom
      const offsetY = (event.clientY - graphNodeMenu.y) / nodeEditor.zoom

      /** @type {GraphNode} */
      let nearestGraphNode = null

      let minSquaredDist = Infinity

      nodeEditor.querySelectorAll('w-graph-node[selected]').forEach((
        /** @type {GraphNode} */ selectedGraphNode,
      ) => {
        // Duplicates the graph node
        const duplicatedGraphNode = /** @type {GraphNode} */ (selectedGraphNode.cloneNode(
          true,
        ))
        duplicatedGraphNode.x += offsetX
        duplicatedGraphNode.y += offsetY
        nodeEditor.appendChild(duplicatedGraphNode)

        // Finds the nearest graph node which is behind the mouse
        if (!nearestGraphNode) {
          nearestGraphNode = duplicatedGraphNode
        } else if (
          duplicatedGraphNode.x <= mousePosition.x &&
          duplicatedGraphNode.y <= mousePosition.y
        ) {
          const graphNodeSquaredDist = squaredDist(
            duplicatedGraphNode,
            mousePosition,
          )
          if (graphNodeSquaredDist < minSquaredDist) {
            nearestGraphNode = duplicatedGraphNode
            minSquaredDist = graphNodeSquaredDist
          }
        }

        // Unselects the already existing node (the one that was duplicated)
        selectedGraphNode.selected = false
      })

      nearestGraphNode.moving = true
    })

    graphNodeMenuItemDelete.addEventListener('click', () => {
      nodeEditor
        .querySelectorAll('w-graph-node[selected]')
        .forEach((selectedGraphNode) => selectedGraphNode.remove())
    })
  },
})
