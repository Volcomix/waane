/**
 * @typedef {import('../base/menu.js').default} Menu
 * @typedef {import('./graph-node.js').default} GraphNode
 */

/**
 * @param {HTMLElement} host
 * @param {Menu} menu
 */
export default function useMenuGraphNode(host, menu) {
  /**
   * @param {MouseEvent} event
   */
  function setMenuPosition(event) {
    const { width, height } = menu.getBoundingClientRect()
    menu.x = Math.min(
      event.clientX,
      document.documentElement.clientWidth - width,
    )
    menu.y = Math.min(
      event.clientY,
      document.documentElement.clientHeight - height,
    )
  }

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
          /** @type {GraphNode} */ element,
        ) => {
          element.selected = false
        })
      }
      graphNode.selected = true
    }

    menu.open = true
    setMenuPosition(event)
  })
}
