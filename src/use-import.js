import { clearAllIds } from './shared/helpers/id.js'

/**
 * @typedef {import('./audio-tracker/audio-track.js').default} AudioTrack
 * @typedef {import('./audio-tracker/track-effect.js').default} TrackEffect
 * @typedef {import('./shared/node-editor/graph-node.js').default} GraphNode
 * @typedef {import('./shared/node-editor/graph-link.js').default} GraphLink
 *
 * @typedef {object} ImportNode
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {Object<string, string>} attributes
 * @property {string[]} outputs
 * @property {string[]} inputs
 *
 * @typedef {object} ImportLink
 * @property {string} from
 * @property {string} to
 *
 * @typedef {object} ImportTrack
 * @property {string} label
 * @property {Object<number, string>} effects
 *
 * @typedef {object} ImportContent
 * @property {Object<string, string>} nodeEditor
 * @property {ImportNode[]} nodes
 * @property {ImportLink[]} links
 * @property {ImportTrack[]} tracks
 */

/**
 * @param {HTMLElement} audioTracker
 * @param {HTMLElement} audioNodeEditor
 */
export function clearAll(audioTracker, audioNodeEditor) {
  audioNodeEditor.shadowRoot.querySelectorAll('w-graph-node').forEach((graphNode) => {
    graphNode.parentElement.remove()
  })
  audioNodeEditor.shadowRoot.querySelectorAll('w-graph-link').forEach((graphLink) => {
    graphLink.remove()
  })
  audioTracker.shadowRoot.querySelectorAll('audio-track').forEach((audioTrack) => {
    audioTrack.remove()
  })
  clearAllIds()
}

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
 * @param {ImportContent} content
 * @param {HTMLElement} audioTracker
 */
function importTracks(content, audioTracker) {
  /** @type {Map<string, string>} */
  const trackLabels = new Map()

  content.tracks.forEach((track) => {
    const audioTrack = /** @type {AudioTrack} */ (document.createElement('audio-track'))
    for (let i = 0; i < 16; i++) {
      const trackEffect = /** @type {TrackEffect} */ (document.createElement('track-effect'))
      trackEffect.beat = i % 4 === 0
      if (i in track.effects) {
        trackEffect.value = track.effects[i]
      }
      audioTrack.appendChild(trackEffect)
    }
    audioTracker.shadowRoot.querySelector('div').appendChild(audioTrack)
    trackLabels.set(track.label, audioTrack.label)
  })
  return trackLabels
}

/**
 * @param {ImportContent} content
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
 * @param {ImportContent} content
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
 * @param {HTMLElement} element
 * @param {HTMLElement} audioTracker
 * @param {HTMLElement} audioNodeEditor
 */
export default function useImport(element, audioTracker, audioNodeEditor) {
  element.addEventListener('click', () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.addEventListener('change', async () => {
      if (input.files.length !== 1) {
        return
      }
      const file = input.files[0]
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        /** @type {ImportContent} */
        const content = JSON.parse(/** @type {string} */ (fileReader.result))

        /** @type {HTMLElement} */
        const nodeEditor = audioNodeEditor.shadowRoot.querySelector('w-node-editor')

        clearAll(audioTracker, audioNodeEditor)
        const trackLabels = importTracks(content, audioTracker)
        importAttributes(content.nodeEditor, nodeEditor)
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
      })
      fileReader.readAsText(file)
    })
    input.click()
  })
}
