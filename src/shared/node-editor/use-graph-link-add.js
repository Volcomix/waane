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
    graphLink.from = event.detail.from
    graphLink.linking = true
    host.appendChild(graphLink)
    host.linking = true
  })

  host.addEventListener('graph-link-disconnect', (
    /** @type {CustomEvent} */ event,
  ) => {
    graphLink = /** @type {GraphLink} */ (host.querySelector(
      `w-graph-link[to='${event.detail.to}']`,
    ))
    if (!graphLink) {
      return
    }
    // Move at the end of the host DOM to allow selecting
    // another link after reconnecting this one
    graphLink.remove()
    host.appendChild(graphLink)
    graphLink.linking = true
    host.linking = true
  })

  host.addEventListener('graph-link-end', (
    /** @type {CustomEvent} */ event,
  ) => {
    if (!graphLink) {
      return
    }
    graphLink.to = event.detail.to
    graphLink.toX = null
    graphLink.toY = null
  })

  host.addEventListener('mousemove', (event) => {
    if (!graphLink) {
      return
    }
    const { x, y } = getNodeEditorMousePosition(event)
    graphLink.to = null
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
    host.linking = false
    graphLink.linking = false
    graphLink = null
  })
}
