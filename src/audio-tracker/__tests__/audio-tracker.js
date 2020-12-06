import { expect, test } from '@jest/globals'
import '../../index'
import { contextMenu, findFieldInputByLabel, setup } from '../../testing/helpers'

/**
 * @typedef {import('../track-effect').default} TrackEffect
 */

test('has no track by default', () => {
  const { getAudioTracks } = setup('Tracks')
  expect(getAudioTracks()).toHaveLength(0)
})

test('adds tracks', () => {
  const { addAudioTrack, getAudioTracks } = setup('Tracks')
  addAudioTrack()
  expect(getAudioTracks().map((audioTrack) => audioTrack.shadowRoot.querySelector('label').textContent)).toEqual(['1'])
  addAudioTrack()
  expect(getAudioTracks().map((audioTrack) => audioTrack.shadowRoot.querySelector('label').textContent)).toEqual([
    '1',
    '2',
  ])
})

test('deletes tracks', () => {
  const { getMenuItem, addAudioTrack, getAudioTracks } = setup('Tracks')
  addAudioTrack()
  addAudioTrack()
  const audioTracks = getAudioTracks()
  const [audioTrack1, audioTrack2] = audioTracks

  expect(audioTracks).toHaveLength(2)

  contextMenu(audioTrack1)
  getMenuItem('Delete track').click()

  const remainingAudioGracks = getAudioTracks()
  expect(remainingAudioGracks).toHaveLength(1)
  expect(remainingAudioGracks[0]).toBe(audioTrack2)
})

test('updates lines', () => {
  const { audioTracker, addAudioTrack, getAudioTracks } = setup('Tracks')
  addAudioTrack()
  const [audioTrack1] = getAudioTracks()
  const controls = audioTracker.shadowRoot.querySelector('aside')
  const linesFieldInput = findFieldInputByLabel(controls, 'w-number-field', 'Lines')

  expect(linesFieldInput.valueAsNumber).toBe(64)
  expect(audioTrack1.querySelectorAll('track-effect')).toHaveLength(64)

  linesFieldInput.valueAsNumber = 32
  linesFieldInput.dispatchEvent(new InputEvent('input', { composed: true }))

  expect(audioTrack1.querySelectorAll('track-effect')).toHaveLength(32)

  linesFieldInput.valueAsNumber = 48
  linesFieldInput.dispatchEvent(new InputEvent('input', { composed: true }))

  expect(audioTrack1.querySelectorAll('track-effect')).toHaveLength(48)

  addAudioTrack()
  const audioTrack2 = getAudioTracks()[1]

  expect(audioTrack2.querySelectorAll('track-effect')).toHaveLength(48)
})

test('updates lines per beat', () => {
  const { audioTracker, addAudioTrack, getAudioTracks } = setup('Tracks')
  addAudioTrack()
  const [audioTrack] = getAudioTracks()
  const controls = audioTracker.shadowRoot.querySelector('aside')
  const linesFieldInput = findFieldInputByLabel(controls, 'w-number-field', 'Lines')
  const linesPerBeatFieldInput = findFieldInputByLabel(controls, 'w-number-field', 'Lines per beat')

  linesFieldInput.valueAsNumber = 8
  linesFieldInput.dispatchEvent(new InputEvent('input', { composed: true }))

  let trackEffects = [.../** @type {NodeListOf<TrackEffect>} */ (audioTrack.querySelectorAll('track-effect'))]

  expect(linesPerBeatFieldInput.valueAsNumber).toBe(4)
  expect(trackEffects.map((trackEffect) => trackEffect.beat)).toEqual([
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
  ])

  linesPerBeatFieldInput.valueAsNumber = 2
  linesPerBeatFieldInput.dispatchEvent(new InputEvent('input', { composed: true }))

  expect(trackEffects.map((trackEffect) => trackEffect.beat)).toEqual([
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
  ])

  linesFieldInput.valueAsNumber = 10
  linesFieldInput.dispatchEvent(new InputEvent('input', { composed: true }))
  trackEffects = [.../** @type {NodeListOf<TrackEffect>} */ (audioTrack.querySelectorAll('track-effect'))]

  expect(trackEffects.map((trackEffect) => trackEffect.beat)).toEqual([
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
  ])
})
