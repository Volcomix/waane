import { expect, test } from '@jest/globals'
import '../../index'
import { html } from '../../shared/core/element'

test('has no track by default', () => {
  document.body.innerHTML = html`<audio-tracker></audio-tracker>`
  const audioTracker = document.body.querySelector('audio-tracker')
  const audioTracks = audioTracker.shadowRoot.querySelectorAll('audio-track')
  expect(audioTracks).toHaveLength(0)
})

test('adds tracks', () => {
  document.body.innerHTML = html`<audio-tracker></audio-tracker>`
  const audioTracker = document.body.querySelector('audio-tracker')
  const addButton = /** @type {HTMLElement} */ (audioTracker.shadowRoot.querySelector(
    'w-fab',
  ))
  addButton.click()
  expect(
    [...audioTracker.shadowRoot.querySelectorAll('audio-track')].map(
      (audioTrack) => audioTrack.shadowRoot.querySelector('label').textContent,
    ),
  ).toEqual(['1'])
  addButton.click()
  expect(
    [...audioTracker.shadowRoot.querySelectorAll('audio-track')].map(
      (audioTrack) => audioTrack.shadowRoot.querySelector('label').textContent,
    ),
  ).toEqual(['1', '2'])
})
