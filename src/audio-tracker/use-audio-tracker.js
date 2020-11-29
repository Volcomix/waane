import useAudioContext from '../audio-node-editor/use-audio-context.js'
import { html } from '../shared/core/element.js'

/**
 * @typedef {import('./audio-track.js').default} AudioTrack
 * @typedef {import('./track-effect.js').default} TrackEffect
 * @typedef {import('../audio-node-editor/node-track.js').Track} Track
 * @typedef {import('../shared/base/select.js').default} Select
 * @typedef {import('../shared/base/menu-item.js').default} MenuItem
 */

/** @type {Map<string, TrackEffect[]>} */
const trackEffectsByTrackLabel = new Map()

/** @type {Map<Select, Track>} */
const tracksByField = new Map()

/**
 * @param {AudioTrack} audioTrack
 */
export function registerAudioTrack(audioTrack) {
  trackEffectsByTrackLabel.set(audioTrack.label, [
    .../** @type {NodeListOf<TrackEffect>} */ (audioTrack.querySelectorAll('track-effect')),
  ])
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
  trackEffectsByTrackLabel.delete(audioTrack.label)
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
  trackEffectsByTrackLabel.forEach((_, trackLabel) => {
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

export default function useAudioTracker() {
  const audioContext = useAudioContext()

  /** @type {number} */
  let tempo = 140

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
      const value = trackEffectsByTrackLabel.get(trackLabel)[line].value
      if (value === null) {
        return
      }
      track.trigger(triggerTime)
    })
  }

  function scheduleTrigger() {
    while (triggerTime < audioContext.currentTime + 0.1) {
      trigger()
      const secondsPerBeat = 60 / tempo
      triggerTime += 0.25 * secondsPerBeat
      line++
      if (line === 32) {
        line = 0
      }
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

    getTempo() {
      return tempo
    },

    /**
     * @param {number} newTempo
     */
    setTempo(newTempo) {
      tempo = newTempo
    },
  }
}
