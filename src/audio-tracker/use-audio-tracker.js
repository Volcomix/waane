import useAudioContext from '../audio-node-editor/use-audio-context.js'
import { html } from '../shared/core/element.js'

/**
 * @typedef {import('./audio-tracker.js').default} AudioTracker
 * @typedef {import('./audio-track.js').default} AudioTrack
 * @typedef {import('./track-effect.js').default} TrackEffect
 * @typedef {import('../audio-node-editor/node-track.js').Track} Track
 * @typedef {import('../shared/base/select.js').default} Select
 * @typedef {import('../shared/base/menu-item.js').default} MenuItem
 */

/** @type {Map<string, AudioTrack>} */
const audioTracksByTrackLabel = new Map()

/** @type {Map<Select, Track>} */
const tracksByField = new Map()

export const defaultTempo = 120
export const defaultLines = 64
export const defaultLinesPerBeat = 4

/**
 * @param {AudioTrack} audioTrack
 */
export function registerAudioTrack(audioTrack) {
  audioTracksByTrackLabel.set(audioTrack.label, audioTrack)
  const template = document.createElement('template')
  template.innerHTML = html`<w-menu-item value="${audioTrack.label}">${audioTrack.label}</w-menu-item>`
  tracksByField.forEach((_, selectField) => {
    selectField.appendChild(template.content.cloneNode(true))
  })
}

/**
 * @param {AudioTrack} audioTrack
 */
export function deregisterAudioTrack(audioTrack) {
  audioTracksByTrackLabel.delete(audioTrack.label)
  tracksByField.forEach((_, selectField) => {
    if (selectField.value === audioTrack.label) {
      selectField.value = null
    }
    const menuItem = selectField.querySelector(`w-menu-item[value='${audioTrack.label}']`)
    menuItem.remove()
  })
}

/**
 * @param {Select} selectField
 * @param {Track} track
 */
export function bindAudioTrack(selectField, track) {
  audioTracksByTrackLabel.forEach((_, trackLabel) => {
    const menuItem = /** @type {MenuItem} */ (document.createElement('w-menu-item'))
    menuItem.textContent = trackLabel
    menuItem.value = trackLabel
    selectField.appendChild(menuItem)
  })
  tracksByField.set(selectField, track)
}

/**
 * @param {Select} selectField
 */
export function unbindAudioTrack(selectField) {
  tracksByField.delete(selectField)
}

/**
 * @param {AudioTracker} host
 */
export default function useAudioTracker(host) {
  const audioContext = useAudioContext()

  host.tempo = defaultTempo
  host.lines = defaultLines
  host.linesPerBeat = defaultLinesPerBeat

  /** @type {number} */
  let timeoutID = null

  /** @type {number} */
  let triggerTime

  /** @type {number} */
  let line

  function trigger() {
    tracksByField.forEach((track, selectField) => {
      const trackLabel = selectField.value
      if (trackLabel === null) {
        return
      }
      /** @type {NodeListOf<TrackEffect>} */
      const trackEffects = audioTracksByTrackLabel.get(trackLabel).querySelectorAll('track-effect')
      const value = trackEffects[line].value
      if (value === null) {
        return
      }
      track.trigger(triggerTime)
    })
  }

  function scheduleTrigger() {
    while (triggerTime < audioContext.currentTime + 0.1) {
      if (line >= host.lines) {
        line = 0
      }
      trigger()
      const secondsPerBeat = 60 / host.tempo
      triggerTime += secondsPerBeat / host.linesPerBeat
      line++
    }
    timeoutID = window.setTimeout(scheduleTrigger, 25)
  }

  return {
    startAudioTracker() {
      triggerTime = audioContext.currentTime
      line = 0
      scheduleTrigger()
    },

    stopAudioTracker() {
      if (timeoutID === null) {
        return
      }
      window.clearTimeout(timeoutID)
      timeoutID = null
    },

    isAudioTrackerStarted() {
      return timeoutID !== null
    },
  }
}
