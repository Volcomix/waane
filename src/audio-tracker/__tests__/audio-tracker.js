import { expect, test } from '@jest/globals'
import '../../index'
import { setup } from '../../testing/helpers'

test('has no track by default', () => {
  const { getAudioTracks } = setup('Tracks')
  expect(getAudioTracks()).toHaveLength(0)
})

test('adds tracks', () => {
  const { getAudioTracks, addAudioTrack } = setup('Tracks')
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
  const { audioTracker, getAudioTracks, addAudioTrack } = setup('Tracks')
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
