/**
 * @typedef {import('../shared/base/menu.js').default} Menu
 * @typedef {import('../shared/node-editor/graph-node.js').default} GraphNode
 */

/**
 * @param {HTMLElement} host
 * @param {Menu} menu
 */
export default function useGraphNodeMenu(host, menu) {
  host.addEventListener('contextmenu', (event) => {
    const element = /** @type {Element} */ (event.target)
    const graphNode = /** @type {GraphNode} */ (element.closest('w-graph-node'))
    if (!graphNode) {
      return
    }
    event.stopImmediatePropagation()
    event.preventDefault()

    if (!graphNode.selected) {
      if (!event.ctrlKey && !event.metaKey) {
        host.querySelectorAll(`w-graph-node[selected]`).forEach((
          /** @type {GraphNode} */ selectedGraphNode,
        ) => {
          selectedGraphNode.selected = false
        })
      }
      graphNode.selected = true
    }
    menu.open = true
    menu.x = event.clientX
    menu.y = event.clientY
  })
}
