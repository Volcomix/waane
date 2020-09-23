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
    let element = /** @type {Element} */ (event.target)
    while (!element.matches('w-graph-node')) {
      if (element === host) {
        return
      }
      element = element.parentElement
    }
    event.stopImmediatePropagation()
    event.preventDefault()

    let graphNode = /** @type {GraphNode} */ (element)
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
