import { expect, test } from '@jest/globals'
import '../../index'
import { html } from '../../shared/core/element'

function setup() {
  document.body.innerHTML = html`<audio-tracker></audio-tracker>`
  const audioTracker = document.body.querySelector('audio-tracker')
  const addButton = /** @type {HTMLElement} */ (audioTracker.shadowRoot.querySelector(
    'w-fab',
  ))

  function getAudioTracks() {
    return [...audioTracker.shadowRoot.querySelectorAll('audio-track')]
  }

  function addAudioTrack() {
    addButton.click()
  }

  return {
    audioTracker,
    getAudioTracks,
    addAudioTrack,
  }
}

test('has no track by default', () => {
  const { getAudioTracks } = setup()
  expect(getAudioTracks()).toHaveLength(0)
})

test('adds tracks', () => {
  const { getAudioTracks, addAudioTrack } = setup()
  addAudioTrack()
  expect(
    getAudioTracks().map(
      (audioTrack) => audioTrack.shadowRoot.querySelector('label').textContent,
    ),
  ).toEqual(['1'])
  addAudioTrack()
  expect(
    getAudioTracks().map(
      (audioTrack) => audioTrack.shadowRoot.querySelector('label').textContent,
    ),
  ).toEqual(['1', '2'])
})

test('deletes tracks', () => {
  const { audioTracker, getAudioTracks, addAudioTrack } = setup()
  addAudioTrack()
  addAudioTrack()
  const audioTracks = getAudioTracks()
  const [audioTrack1, audioTrack2] = audioTracks

  expect(audioTracks).toHaveLength(2)

  audioTrack1.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }))
  ;[
    .../** @type {NodeListOf<HTMLElement>} */ (audioTracker.shadowRoot.querySelectorAll(
      'w-menu[open] w-menu-item',
    )),
  ]
    .find((element) => element.textContent.includes('Delete track'))
    .click()

  const remainingAudioGracks = getAudioTracks()
  expect(remainingAudioGracks).toHaveLength(1)
  expect(remainingAudioGracks[0]).toBe(audioTrack2)
})
