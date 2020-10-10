/**
 * @typedef {import('./node-editor.js').default} NodeEditor
 * @typedef {import('./graph-node.js').default} GraphNode
 */

/**
 * @param {NodeEditor} host
 */
export default function useGraphNodeMove(host) {
  /**
   * @returns {NodeListOf<GraphNode>}
   */
  function getSelectedGraphNodes() {
    return host.querySelectorAll(`w-graph-node[selected]`)
  }

  /**
   * @returns {GraphNode}
   */
  function getMovingGraphNode() {
    return host.querySelector(`w-graph-node[moving]`)
  }

  host.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || event.altKey) {
      return
    }
    if (event.composedPath()[0] instanceof HTMLInputElement) {
      return
    }
    if (host.querySelector('w-graph-node[moving]')) {
      return
    }
    const element = /** @type {Element} */ (event.target)
    const graphNode = /** @type {GraphNode} */ (element.closest('w-graph-node'))
    if (graphNode) {
      graphNode.moving = true
    }
  })

  host.addEventListener('mousemove', (event) => {
    const movingGraphNode = getMovingGraphNode()
    if (!movingGraphNode) {
      return
    }
    host.moving = true
    if (!movingGraphNode.selected) {
      if (!event.ctrlKey && !event.metaKey) {
        getSelectedGraphNodes().forEach((selectedGraphNode) => {
          selectedGraphNode.selected = false
        })
      }
      movingGraphNode.selected = true
    }
    getSelectedGraphNodes().forEach((selectedGraphNode) => {
      selectedGraphNode.x += event.movementX / host.zoom
      selectedGraphNode.y += event.movementY / host.zoom
    })
  })

  host.addEventListener('mouseup', () => {
    const movingGraphNode = getMovingGraphNode()
    if (movingGraphNode) {
      movingGraphNode.moving = false
    }
  })

  host.addEventListener('click', (event) => {
    if (host.moving) {
      event.stopImmediatePropagation()
      host.moving = false
    }
  })
}
