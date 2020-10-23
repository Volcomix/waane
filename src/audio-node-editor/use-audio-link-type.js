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

  host.addEventListener('graph-link-start', (
    /** @type {GraphLinkEvent} */ event,
  ) => {
    /** @type {string} */
    let linkingType
    if (event.detail.from) {
      const output = /** @type {GraphNodeOutput} */ (event.target)
      linking = 'output'
      linkingType = output.type
    } else if (event.detail.to) {
      const graphLink = /** @type {GraphLink} */ (host.querySelector(
        `w-graph-link[to='${event.detail.to}']`,
      ))
      const output = /** @type {GraphNodeOutput} */ (graphLink?.from &&
        host.querySelector(`w-graph-node-output#${graphLink.from}`))
      if (output) {
        linking = 'output'
        linkingType = output.type
      } else {
        const input = /** @type {GraphNodeInput} */ (event.target)
        linking = 'input'
        linkingType = input.type
      }
    }

    const disabledLinkType =
      linkingType === 'audio'
        ? 'trigger'
        : linkingType === 'trigger'
        ? 'audio'
        : null

    if (disabledLinkType) {
      const disabledSocketType = linking === 'output' ? 'input' : 'output'
      host
        .querySelectorAll(
          `w-graph-node-${disabledSocketType}[type='${disabledLinkType}']`,
        )
        .forEach((
          /** @type {GraphNodeOutput | GraphNodeInput} */ outputOrInput,
        ) => {
          outputOrInput.disabled = true
        })
    }
  })

  host.addEventListener('click', () => {
    if (linking === null) {
      return
    }
    host.querySelectorAll(`w-graph-node-output[disabled]`).forEach((
      /** @type {GraphNodeOutput} */ output,
    ) => {
      output.disabled = false
    })
    host.querySelectorAll(`w-graph-node-input[disabled]`).forEach((
      /** @type {GraphNodeInput} */ input,
    ) => {
      input.disabled = false
    })
    linking = null
  })
}
