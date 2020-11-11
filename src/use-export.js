/**
 * @typedef {import('./shared/node-editor/graph-node.js').default} GraphNode
 * @typedef {import('./shared/node-editor/graph-link.js').default} GraphLink
 * @typedef {import('./audio-tracker/track-effect.js').default} TrackEffect
 * @typedef {import('./audio-tracker/audio-track.js').default} AudioTrack
 */

/**
 * @param {NamedNodeMap} attributes
 */
function exportAttributes(attributes) {
  return [...attributes].reduce(
    (attributes, { name, value }) =>
      Object.assign(attributes, {
        [name]: value,
      }),
    {},
  )
}

/**
 * @param {HTMLElement} audioNodeEditor
 */
function exportNodes(audioNodeEditor) {
  return [.../** @type {NodeListOf<GraphNode>} */ (audioNodeEditor.shadowRoot.querySelectorAll('w-graph-node'))].map(
    (graphNode) => ({
      name: graphNode.parentElement.tagName.toLowerCase(),
      x: graphNode.x,
      y: graphNode.y,
      attributes: exportAttributes(graphNode.parentElement.attributes),
      outputs: [...graphNode.querySelectorAll('w-graph-node-output')].map((output) => output.id),
      inputs: [...graphNode.querySelectorAll('w-graph-node-input')].map((input) => input.id),
    }),
  )
}

/**
 * @param {HTMLElement} audioNodeEditor
 */
function exportLinks(audioNodeEditor) {
  return [
    .../** @type {NodeListOf<GraphLink>} */ (audioNodeEditor.shadowRoot.querySelectorAll('w-graph-link')),
  ].map(({ from, to }) => ({ from, to }))
}

/**
 * @param {HTMLElement} audioTrack
 */
function exportEffects(audioTrack) {
  return [.../** @type {NodeListOf<TrackEffect>} */ (audioTrack.querySelectorAll('track-effect'))].reduce(
    (effects, trackEffect, index) => {
      if (trackEffect.value === null) {
        return effects
      } else {
        return Object.assign(effects, { [index]: trackEffect.value })
      }
    },
    {},
  )
}

/**
 * @param {HTMLElement} audioTracker
 */
function exportTracks(audioTracker) {
  return [.../** @type {NodeListOf<AudioTrack>} */ (audioTracker.shadowRoot.querySelectorAll('audio-track'))].map(
    (audioTrack) => ({
      label: audioTrack.label,
      effects: exportEffects(audioTrack),
    }),
  )
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} audioTracker
 * @param {HTMLElement} audioNodeEditor
 */
export default function useExport(element, audioTracker, audioNodeEditor) {
  element.addEventListener('click', () => {
    const nodeEditor = exportAttributes(audioNodeEditor.shadowRoot.querySelector('w-node-editor').attributes)
    const nodes = exportNodes(audioNodeEditor)
    const links = exportLinks(audioNodeEditor)
    const tracks = exportTracks(audioTracker)
    const blob = new Blob([JSON.stringify({ nodeEditor, nodes, links, tracks }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'waane-export.json'
    link.click()
    URL.revokeObjectURL(url)
  })
}
