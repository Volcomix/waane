import { audioBuffers } from '../audio-node-editor/node-audio-file.js'
import useAudioContext from '../audio-node-editor/use-audio-context.js'
import { clearAll } from './file-helper.js'

/**
 * @typedef {import('../audio-tracker/audio-tracker.js').default} AudioTracker
 * @typedef {import('../audio-tracker/audio-track.js').default} AudioTrack
 * @typedef {import('../audio-tracker/track-effect.js').default} TrackEffect
 * @typedef {import('../shared/node-editor/graph-node.js').default} GraphNode
 * @typedef {import('../shared/node-editor/graph-link.js').default} GraphLink
 * @typedef {import('./file-helper.js').FileContent} FileContent
 */

/**
 * @param {Object<string, string>} attributes
 * @param {HTMLElement} element
 */
function importAttributes(attributes, element) {
  Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
    element.setAttribute(attributeName, attributeValue)
  })
}

/**
 * @param {FileContent} content
 * @param {AudioTracker} audioTracker
 */
function importTracker(content, audioTracker) {
  if (!content.tracker) {
    return
  }
  if (isFinite(content.tracker.tempo)) {
    audioTracker.tempo = content.tracker.tempo
  }
  if (isFinite(content.tracker.lines)) {
    audioTracker.lines = content.tracker.lines
  }
  if (isFinite(content.tracker.linesPerBeat)) {
    audioTracker.linesPerBeat = content.tracker.linesPerBeat
  }
}

/**
 * @param {FileContent} content
 * @param {AudioTracker} audioTracker
 */
function importTracks(content, audioTracker) {
  /** @type {Map<string, string>} */
  const trackLabels = new Map()

  content.tracks.forEach((track) => {
    const audioTrack = /** @type {AudioTrack} */ (document.createElement('audio-track'))
    for (let i = 0; i < audioTracker.lines; i++) {
      const trackEffect = /** @type {TrackEffect} */ (document.createElement('track-effect'))
      trackEffect.beat = i % audioTracker.linesPerBeat === 0
      if (i in track.effects) {
        trackEffect.value = track.effects[i]
      }
      audioTrack.appendChild(trackEffect)
    }
    audioTracker.shadowRoot.querySelector('.tracks').appendChild(audioTrack)
    trackLabels.set(track.label, audioTrack.label)
  })
  return trackLabels
}

/**
 * @param {FileContent} content
 */
function importAudioFiles(content) {
  if (!content.audioFiles) {
    return
  }
  const audioContext = useAudioContext()
  content.audioFiles.forEach((audioFile) => {
    const audioBuffer = audioContext.createBuffer(audioFile.channels.length, audioFile.length, audioFile.sampleRate)
    audioFile.channels.forEach((encodedchannelData, channel) => {
      const channelData = new Uint8Array(audioBuffer.getChannelData(channel).buffer)
      const decodedChannelData = atob(encodedchannelData)
      for (let i = 0; i < decodedChannelData.length; i++) {
        channelData[i] = decodedChannelData.charCodeAt(i)
      }
    })
    audioBuffers.set(audioFile.hash, audioBuffer)
  })
}

/**
 * @param {FileContent} content
 * @param {Map<string, string>} trackLabels
 * @param {HTMLElement} nodeEditor
 */
function importNodes(content, trackLabels, nodeEditor) {
  /** @type {Map<string, string>} */
  const nodeOutputs = new Map()

  /** @type {Map<string, string>} */
  const nodeInputs = new Map()

  content.nodes.forEach((node) => {
    if (node.attributes.track) {
      node.attributes.track = trackLabels.get(node.attributes.track)
    }
    const audioNode = document.createElement(node.name)
    nodeEditor.appendChild(audioNode)
    importAttributes(node.attributes, audioNode)
    const graphNode = /** @type {GraphNode} */ (audioNode.querySelector('w-graph-node'))
    graphNode.x = node.x
    graphNode.y = node.y
    audioNode.querySelectorAll('w-graph-node-output').forEach((output, index) => {
      nodeOutputs.set(node.outputs[index], output.id)
    })
    audioNode.querySelectorAll('w-graph-node-input').forEach((input, index) => {
      nodeInputs.set(node.inputs[index], input.id)
    })
  })
  return { nodeOutputs, nodeInputs }
}

/**
 * @param {FileContent} content
 * @param {Map<string, string>} outputs
 * @param {Map<string, string>} inputs
 * @param {HTMLElement} nodeEditor
 */
function importLinks(content, outputs, inputs, nodeEditor) {
  content.links.forEach((link) => {
    const graphLink = /** @type {GraphLink} */ (document.createElement('w-graph-link'))
    graphLink.from = outputs.get(link.from)
    graphLink.to = inputs.get(link.to)
    nodeEditor.appendChild(graphLink)
    nodeEditor.dispatchEvent(
      new CustomEvent('graph-link-connect', {
        detail: {
          from: graphLink.from,
          to: graphLink.to,
        },
      }),
    )
  })
}

/**
 *
 * @param {FileContent} content
 * @param {HTMLElement} audioNodeEditor
 * @param {AudioTracker} audioTracker
 */
export default function importFile(content, audioTracker, audioNodeEditor) {
  /** @type {HTMLElement} */
  const nodeEditor = audioNodeEditor.shadowRoot.querySelector('w-node-editor')

  clearAll(audioTracker, audioNodeEditor)
  importTracker(content, audioTracker)
  const trackLabels = importTracks(content, audioTracker)
  importAttributes(content.nodeEditor, nodeEditor)
  importAudioFiles(content)
  const { nodeOutputs, nodeInputs } = importNodes(content, trackLabels, nodeEditor)
  let wasAudioNodeEditorHidden = false
  if (audioNodeEditor.hidden) {
    wasAudioNodeEditorHidden = true

    // Audio node editor must not be hidden for the graph links
    // to be positionned correctly
    audioNodeEditor.hidden = false
  }
  importLinks(content, nodeOutputs, nodeInputs, nodeEditor)
  if (wasAudioNodeEditorHidden) {
    audioNodeEditor.hidden = true
  }
}
