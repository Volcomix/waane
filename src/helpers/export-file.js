import { audioBuffers } from '../audio-node-editor/node-audio-file.js'

/**
 * @typedef {import('../shared/node-editor/graph-node.js').default} GraphNode
 * @typedef {import('../shared/node-editor/graph-link.js').default} GraphLink
 * @typedef {import('../audio-node-editor/node-audio-file.js').default} NodeAudioFile
 * @typedef {import('../audio-tracker/audio-tracker.js').default} AudioTracker
 * @typedef {import('../audio-tracker/audio-track.js').default} AudioTrack
 * @typedef {import('../audio-tracker/track-effect.js').default} TrackEffect
 * @typedef {import('./file-helper.js').FileContent} FileContent
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
 * @param {AudioTracker} audioTracker
 */
function exportTracker(audioTracker) {
  return {
    tempo: audioTracker.tempo,
    lines: audioTracker.lines,
    linesPerBeat: audioTracker.linesPerBeat,
  }
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
 * @param {HTMLElement} audioNodeEditor
 */
function exportAudioFiles(audioNodeEditor) {
  const audioFiles = [
    .../** @type {NodeListOf<NodeAudioFile>} */ (audioNodeEditor.shadowRoot.querySelectorAll('node-audio-file')),
  ]
  const hashes = [...new Set(audioFiles.map((audioFile) => audioFile.hash).filter((hash) => hash))]
  return hashes.map((hash) => {
    const audioBuffer = audioBuffers.get(hash)
    return {
      hash,
      length: audioBuffer.length,
      sampleRate: audioBuffer.sampleRate,
      channels: Array.from({ length: audioBuffer.numberOfChannels }, (_, channel) => {
        const channelData = new Uint8Array(audioBuffer.getChannelData(channel).buffer)
        return btoa([...channelData].map((codeUnit) => String.fromCharCode(codeUnit)).join(''))
      }),
    }
  })
}

/**
 * @param {AudioTracker} audioTracker
 * @param {HTMLElement} audioNodeEditor
 * @returns {FileContent}
 */
export default function exportFile(audioTracker, audioNodeEditor) {
  return {
    nodeEditor: exportAttributes(audioNodeEditor.shadowRoot.querySelector('w-node-editor').attributes),
    nodes: exportNodes(audioNodeEditor),
    links: exportLinks(audioNodeEditor),
    tracker: exportTracker(audioTracker),
    tracks: exportTracks(audioTracker),
    audioFiles: exportAudioFiles(audioNodeEditor),
  }
}
