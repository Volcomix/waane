import useNodeEditorMousePosition from './use-node-editor-mouse-position.js'

/**
 * @typedef {import('./node-editor.js').default} NodeEditor
 * @typedef {import('./graph-link.js').default} GraphLink
 *
 * @typedef {object} GraphLinkEventDetail
 * @property {string} [from]
 * @property {string} [to]
 *
 * @typedef {CustomEvent<GraphLinkEventDetail>} GraphLinkEvent
 */

/**
 * @param {NodeEditor} host
 */
export default function useGraphLink(host) {
  /** @type {GraphLink} */
  let graphLink = null

  /** @type {boolean} */
  let isConnected

  const getNodeEditorMousePosition = useNodeEditorMousePosition(host)

  host.addEventListener('graph-link-start', (
    /** @type {GraphLinkEvent} */ event,
  ) => {
    if (event.detail.from) {
      graphLink = /** @type {GraphLink} */ (document.createElement(
        'w-graph-link',
      ))
      graphLink.from = event.detail.from
      host.linking = 'output'
      isConnected = false
    } else if (event.detail.to) {
      graphLink = /** @type {GraphLink} */ (host.querySelector(
        `w-graph-link[to='${event.detail.to}']`,
      ))
      if (graphLink) {
        // Moves at the end of the host DOM to allow selecting
        // another link after reconnecting this one
        graphLink.remove()
        host.linking = 'output'
        isConnected = true
      } else {
        graphLink = /** @type {GraphLink} */ (document.createElement(
          'w-graph-link',
        ))
        graphLink.to = event.detail.to
        host.linking = 'input'
        isConnected = false
      }
    }
    graphLink.linking = true
    host.appendChild(graphLink)
  })

  host.addEventListener('graph-link-end', (
    /** @type {GraphLinkEvent} */ event,
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
    if (isConnected) {
      host.dispatchEvent(
        new CustomEvent('graph-link-disconnect', {
          detail: { from: graphLink.from, to: graphLink.to },
        }),
      )
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
    isConnected = false
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
    if (!isConnected && graphLink.from && graphLink.to) {
      const existingGraphLinks = host.querySelectorAll(
        `w-graph-link[from='${graphLink.from}'][to='${graphLink.to}']`,
      )
      if (existingGraphLinks.length > 1) {
        graphLink.remove()
      } else {
        host.dispatchEvent(
          new CustomEvent('graph-link-connect', {
            detail: { from: graphLink.from, to: graphLink.to },
          }),
        )
      }
    }
    host.linking = null
    graphLink.linking = false
    graphLink = null
  })
}
