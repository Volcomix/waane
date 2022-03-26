/**
 * @typedef {import('../shared/node-editor/use-graph-link.js').GraphLinkEvent} GraphLinkEvent
 * @typedef {import('./node-schedule.js').Schedule} Schedule
 *
 * @typedef {AudioNode | AudioParam | Schedule} Destination
 *
 * @typedef {object} Source
 * @property {(destination: Destination) => void} connect
 * @property {() => void} disconnect
 */

/** @type {WeakMap<HTMLElement, Source>} */
const audioOutputs = new WeakMap()

/** @type {WeakMap<HTMLElement, Destination>} */
const audioInputs = new WeakMap()

/** @type {WeakMap<HTMLElement, Set<HTMLElement>>} */
const links = new WeakMap()

/**
 * @param {HTMLElement} element
 * @param {Source} source
 */
export function bindAudioOutput(element, source) {
  audioOutputs.set(element, source)
}

/**
 * @param {HTMLElement} element
 * @param {Destination} destination
 */
export function bindAudioInput(element, destination) {
  audioInputs.set(element, destination)
}

/**
 * @param {HTMLElement} host
 */
export default function useAudioLink(host) {
  host.addEventListener('graph-link-connect', (/** @type {GraphLinkEvent} */ event) => {
    /** @type {HTMLElement} */
    const output = host.querySelector(`w-graph-node-output#${event.detail.from}`)

    /** @type {HTMLElement} */
    const input = host.querySelector(`w-graph-node-input#${event.detail.to}`)

    const source = audioOutputs.get(output)
    const destination = audioInputs.get(input)
    source.connect(destination)

    if (links.has(output)) {
      links.get(output).add(input)
    } else {
      links.set(output, new Set([input]))
    }
  })

  host.addEventListener('graph-link-disconnect', (/** @type {GraphLinkEvent} */ event) => {
    /** @type {HTMLElement} */
    const output = host.querySelector(`w-graph-node-output#${event.detail.from}`)

    /** @type {HTMLElement} */
    const disconnectedInput = host.querySelector(`w-graph-node-input#${event.detail.to}`)

    const source = audioOutputs.get(output)
    source.disconnect()

    const inputs = links.get(output)
    inputs.delete(disconnectedInput)

    if (inputs.size > 0) {
      inputs.forEach((input) => {
        const destination = audioInputs.get(input)
        source.connect(destination)
      })
    } else {
      links.delete(output)
    }
  })
}
