/**
 * @typedef {import('./node-editor.js').default} NodeEditor
 * @typedef {import('./graph-node.js').default} GraphNode
 */

/**
 * @param {NodeEditor} host
 */
export default function useGraphNodeMove(host) {
  let isMoving = false

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
    if (host.querySelector('w-graph-node[moving]')) {
      return
    }
    let element = /** @type {Element} */ (event.target)
    while (!element.matches('w-graph-node')) {
      if (element === host) {
        return
      }
      element = element.parentElement
    }
    const graphNode = /** @type {GraphNode} */ (element)
    graphNode.moving = true
  })

  host.addEventListener('mousemove', (event) => {
    const movingGraphNode = getMovingGraphNode()
    if (!movingGraphNode) {
      return
    }
    isMoving = true
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
    if (isMoving) {
      event.stopImmediatePropagation()
      isMoving = false
    }
  })
}
