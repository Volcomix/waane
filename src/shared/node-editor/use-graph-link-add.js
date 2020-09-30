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
    if (event.detail.from) {
      graphLink = /** @type {GraphLink} */ (document.createElement(
        'w-graph-link',
      ))
      graphLink.from = event.detail.from
      host.linking = 'output'
    } else if (event.detail.to) {
      graphLink = /** @type {GraphLink} */ (host.querySelector(
        `w-graph-link[to='${event.detail.to}']`,
      ))
      if (graphLink) {
        // Move at the end of the host DOM to allow selecting
        // another link after reconnecting this one
        graphLink.remove()
        host.linking = 'output'
      } else {
        graphLink = /** @type {GraphLink} */ (document.createElement(
          'w-graph-link',
        ))
        graphLink.to = event.detail.to
        host.linking = 'input'
      }
    }
    graphLink.linking = true
    host.appendChild(graphLink)
  })

  host.addEventListener('graph-link-end', (
    /** @type {CustomEvent} */ event,
  ) => {
    if (!graphLink) {
      return
    }
    if (host.linking === 'output') {
      graphLink.to = event.detail.to
      graphLink.toX = null
      graphLink.toY = null
    } else if (host.linking === 'input') {
      graphLink.from = event.detail.from
      graphLink.fromX = null
      graphLink.fromY = null
    }
  })

  host.addEventListener('mousemove', (event) => {
    if (!graphLink) {
      return
    }
    const { x, y } = getNodeEditorMousePosition(event)
    if (host.linking === 'output') {
      graphLink.to = null
      graphLink.toX = x
      graphLink.toY = y
    } else if (host.linking === 'input') {
      graphLink.from = null
      graphLink.fromX = x
      graphLink.fromY = y
    }
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
    host.linking = null
    graphLink.linking = false
    graphLink = null
  })
}
