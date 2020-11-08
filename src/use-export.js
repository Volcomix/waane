/**
 * @param {NamedNodeMap} attributes
 */
function exportAttributes(attributes) {
  return [...attributes].reduce(
    (attributes, { name, value }) =>
      Object.assign(attributes, { [name]: value }),
    {},
  )
}

/**
 * @param {HTMLElement} audioNodeEditor
 */
function exportNodes(audioNodeEditor) {
  return [
    .../** @type {NodeListOf<import('./shared/node-editor/graph-node.js').default>} */ (audioNodeEditor.shadowRoot.querySelectorAll(
      'w-graph-node',
    )),
  ].map((graphNode) => ({
    name: graphNode.parentElement.tagName.toLowerCase(),
    x: graphNode.x,
    y: graphNode.y,
    attributes: exportAttributes(graphNode.parentElement.attributes),
    outputs: [...graphNode.querySelectorAll('w-graph-node-output')].map(
      (output) => output.id,
    ),
    inputs: [...graphNode.querySelectorAll('w-graph-node-input')].map(
      (input) => input.id,
    ),
  }))
}

/**
 * @param {HTMLElement} audioNodeEditor
 */
function exportLinks(audioNodeEditor) {
  return [
    .../** @type {NodeListOf<import('./shared/node-editor/graph-link.js').default>} */ (audioNodeEditor.shadowRoot.querySelectorAll(
      'w-graph-link',
    )),
  ].map(({ from, to }) => ({ from, to }))
}

/**
 * @param {HTMLElement} audioTrack
 */
function exportEffects(audioTrack) {
  return [
    .../** @type {NodeListOf<import('./audio-tracker/track-effect.js').default>} */ (audioTrack.querySelectorAll(
      'track-effect',
    )),
  ].reduce(
    (effects, trackEffect, index) =>
      trackEffect.value === null
        ? effects
        : Object.assign(effects, { [index]: trackEffect.value }),
    {},
  )
}

/**
 * @param {HTMLElement} audioTracker
 */
function exportTracks(audioTracker) {
  return [
    .../** @type {NodeListOf<import('./audio-tracker/audio-track.js').default>} */ (audioTracker.shadowRoot.querySelectorAll(
      'audio-track',
    )),
  ].map((audioTrack) => ({
    label: audioTrack.label,
    effects: exportEffects(audioTrack),
  }))
}

/**
 * @param {HTMLElement} button
 * @param {HTMLElement} audioTracker
 * @param {HTMLElement} audioNodeEditor
 */
export default function useExport(button, audioTracker, audioNodeEditor) {
  button.addEventListener('click', () => {
    const nodeEditor = exportAttributes(
      audioNodeEditor.shadowRoot.querySelector('w-node-editor').attributes,
    )
    const nodes = exportNodes(audioNodeEditor)
    const links = exportLinks(audioNodeEditor)
    const tracks = exportTracks(audioTracker)
    console.log({ nodeEditor, nodes, links, tracks })
  })
}
