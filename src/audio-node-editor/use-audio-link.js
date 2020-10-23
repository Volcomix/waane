/** @typedef {import('../shared/node-editor/use-graph-link.js').GraphLinkEvent} GraphLinkEvent */

/** @type {WeakMap<HTMLElement, AudioNode>} */
const audioOutputs = new WeakMap()

/** @type {WeakMap<HTMLElement, AudioNode | AudioParam>} */
const audioInputs = new WeakMap()

/** @type {WeakMap<HTMLElement, Set<HTMLElement>>} */
const links = new WeakMap()

/**
 * @param {HTMLElement} element
 * @param {AudioNode} audioNode
 */
export function bindAudioOutput(element, audioNode) {
  audioOutputs.set(element, audioNode)
}

/**
 * @param {HTMLElement} element
 * @param {AudioNode | AudioParam} audioNode
 */
export function bindAudioInput(element, audioNode) {
  audioInputs.set(element, audioNode)
}

/**
 * @param {HTMLElement} host
 */
export default function useAudioLink(host) {
  host.addEventListener('graph-link-connect', (
    /** @type {GraphLinkEvent} */ event,
  ) => {
    const output = /** @type {HTMLElement} */ (host.querySelector(
      `w-graph-node-output#${event.detail.from}`,
    ))
    const input = /** @type {HTMLElement} */ (host.querySelector(
      `w-graph-node-input#${event.detail.to}`,
    ))
    const source = audioOutputs.get(output)
    const destination = audioInputs.get(input)
    source.connect(/** @type {AudioNode} */ (destination))

    if (links.has(output)) {
      links.get(output).add(input)
    } else {
      links.set(output, new Set([input]))
    }
  })

  host.addEventListener('graph-link-disconnect', (
    /** @type {GraphLinkEvent} */ event,
  ) => {
    const output = /** @type {HTMLElement} */ (host.querySelector(
      `w-graph-node-output#${event.detail.from}`,
    ))
    const disconnectedInput = /** @type {HTMLElement} */ (host.querySelector(
      `w-graph-node-input#${event.detail.to}`,
    ))
    const source = audioOutputs.get(output)
    source.disconnect()

    const inputs = links.get(output)
    inputs.delete(disconnectedInput)

    if (inputs.size > 0) {
      inputs.forEach((input) => {
        const destination = audioInputs.get(input)
        source.connect(/** @type {AudioNode} */ (destination))
      })
    } else {
      links.delete(output)
    }
  })
}
