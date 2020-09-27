/**
 * @typedef {import('./node-editor.js').default} NodeEditor
 * @typedef {import('./graph-link.js').default} GraphLink
 */

import useNodeEditorMousePosition from './use-node-editor-mouse-position.js'

/**
 * @param {NodeEditor} host
 */
export default function useGraphLinkAdd(host) {
  /** @type {GraphLink} */
  let graphLink = null

  const getNodeEditorMousePosition = useNodeEditorMousePosition(host)

  host.addEventListener('graph-link-start', (
    /** @type {CustomEvent} */ event,
  ) => {
    graphLink = /** @type {GraphLink} */ (document.createElement(
      'w-graph-link',
    ))
    graphLink.fromX = event.detail.x
    graphLink.fromY = event.detail.y
    host.appendChild(graphLink)
  })

  host.addEventListener('mousemove', (event) => {
    if (!graphLink) {
      return
    }
    const { x, y } = getNodeEditorMousePosition(event)
    graphLink.toX = x
    graphLink.toY = y
  })

  host.addEventListener('mouseup', () => {
    if (!graphLink) {
      return
    }
    graphLink.remove()
  })

  host.addEventListener('click', (event) => {
    if (!graphLink) {
      return
    }
    event.stopImmediatePropagation()
    graphLink = null
  })
}
