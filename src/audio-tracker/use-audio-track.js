import { html } from '../shared/core/element.js'

/**
 * @typedef {import('./audio-track.js').default} AudioTrack
 * @typedef {import('../shared/base/select.js').default} Select
 * @typedef {import('../shared/base/menu-item.js').default} MenuItem
 */

/** @type {Set<AudioTrack>} */
const audioTracks = new Set()

/** @type {Set<Select>} */
const selectFields = new Set()

/**
 * @param {AudioTrack} audioTrack
 */
export function registerAudioTrack(audioTrack) {
  audioTracks.add(audioTrack)
  const template = document.createElement('template')
  template.innerHTML = html`
    <w-menu-item value="${audioTrack.label}">${audioTrack.label}</w-menu-item>
  `
  selectFields.forEach((selectField) => {
    selectField.appendChild(template.content.cloneNode(true))
  })
}

/**
 * @param {AudioTrack} audioTrack
 */
export function deregisterAudioTrack(audioTrack) {
  audioTracks.delete(audioTrack)
  selectFields.forEach((selectField) => {
    if (selectField.value === audioTrack.label) {
      selectField.value = null
    }
    const menuItem = selectField.querySelector(
      `w-menu-item[value='${audioTrack.label}']`,
    )
    menuItem.remove()
  })
}

/**
 * @param {Select} selectField
 */
export function registerTrackField(selectField) {
  audioTracks.forEach((audioTrack) => {
    const menuItem = /** @type {MenuItem} */ (document.createElement(
      'w-menu-item',
    ))
    menuItem.textContent = audioTrack.label
    menuItem.value = audioTrack.label
    selectField.appendChild(menuItem)
  })
  selectFields.add(selectField)
}

/**
 * @param {Select} selectField
 */
export function deregisterTrackField(selectField) {
  selectFields.delete(selectField)
}
