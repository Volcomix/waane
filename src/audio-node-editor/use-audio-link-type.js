/**
 * @typedef {import('../shared/node-editor/graph-node-output.js').default} GraphNodeOutput
 * @typedef {import('../shared/node-editor/graph-node-input.js').default} GraphNodeInput
 * @typedef {import('../shared/node-editor/graph-link.js').default} GraphLink
 * @typedef {import('../shared/node-editor/use-graph-link.js').GraphLinkEvent} GraphLinkEvent
 */

/**
 * @param {HTMLElement} host
 */
export default function useAudioLinkType(host) {
  /** @type {'output' | 'input'} */
  let linking = null

  /**
   * @param {GraphLinkEvent} event
   */
  function getLinkingType(event) {
    if (event.detail.from) {
      const output = /** @type {GraphNodeOutput} */ (event.target)
      linking = 'output'
      return output.type
    } else {
      const graphLink = /** @type {GraphLink} */ (host.querySelector(
        `w-graph-link[to='${event.detail.to}']`,
      ))
      const output = /** @type {GraphNodeOutput} */ (graphLink?.from &&
        host.querySelector(`w-graph-node-output#${graphLink.from}`))
      if (output) {
        linking = 'output'
        return output.type
      } else {
        const input = /** @type {GraphNodeInput} */ (event.target)
        linking = 'input'
        return input.type
      }
    }
  }

  /**
   * @param {string} selectors
   */
  function disableSockets(selectors) {
    host.querySelectorAll(selectors).forEach((
      /** @type {GraphNodeOutput | GraphNodeInput} */ outputOrInput,
    ) => {
      outputOrInput.disabled = true
    })
  }

  host.addEventListener('graph-link-start', (
    /** @type {GraphLinkEvent} */ event,
  ) => {
    const linkingType = getLinkingType(event)

    switch (linking) {
      case 'output':
        switch (linkingType) {
          case 'trigger':
            disableSockets(`w-graph-node-input:not([type='trigger'])`)
            break
          case 'audio':
            disableSockets(`w-graph-node-input[type='trigger']`)
            break
          default:
            disableSockets(`w-graph-node-input[type]`)
        }
        break
      case 'input':
        switch (linkingType) {
          case 'trigger':
            disableSockets(`w-graph-node-output:not([type='trigger'])`)
            break
          case 'audio':
            disableSockets(`w-graph-node-output:not([type='audio'])`)
            break
          default:
            disableSockets(`w-graph-node-output[type='trigger']`)
        }
        break
    }
  })

  host.addEventListener('click', () => {
    if (linking === null) {
      return
    }
    host
      .querySelectorAll(
        `w-graph-node-output[disabled], w-graph-node-input[disabled]`,
      )
      .forEach((
        /** @type {GraphNodeOutput | GraphNodeInput} */ outputOrInput,
      ) => {
        outputOrInput.disabled = false
      })
    linking = null
  })
}
