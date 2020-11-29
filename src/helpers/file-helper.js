import { clearAllIds } from '../shared/helpers/id.js'

/**
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
