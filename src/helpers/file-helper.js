import { defaultLines, defaultLinesPerBeat, defaultTempo } from '../audio-tracker/use-audio-tracker.js'
import { clearAllIds } from '../shared/helpers/id.js'
import { defaultPanX, defaultPanY, defaultZoom } from '../shared/node-editor/use-mouse-navigation.js'

/**
 * @typedef {import('../audio-tracker/audio-tracker.js').default} AudioTracker
 * @typedef {import('../shared/node-editor/node-editor.js').default} NodeEditor
 *
 * @typedef {object} FileContentNode
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {Object<string, string>} attributes
 * @property {string[]} outputs
 * @property {string[]} inputs
 *
 * @typedef {object} FileContentLink
 * @property {string} from
 * @property {string} to
 *
 * @typedef {object} FileContentTracker
 * @property {number} tempo
 * @property {number} lines
 * @property {number} linesPerBeat
 *
 * @typedef {object} FileContentTrack
 * @property {string} label
 * @property {Object<number, string>} effects
 *
 * @typedef {object} FileContent
 * @property {Object<string, string>} nodeEditor
 * @property {FileContentNode[]} nodes
 * @property {FileContentLink[]} links
 * @property {FileContentTracker} tracker
 * @property {FileContentTrack[]} tracks
 */

/**
 * @param {AudioTracker} audioTracker
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

  /** @type {NodeEditor} */
  const nodeEditor = audioNodeEditor.shadowRoot.querySelector('w-node-editor')

  nodeEditor.zoom = defaultZoom
  nodeEditor.panX = defaultPanX
  nodeEditor.panY = defaultPanY
  audioTracker.tempo = defaultTempo
  audioTracker.lines = defaultLines
  audioTracker.linesPerBeat = defaultLinesPerBeat
}
