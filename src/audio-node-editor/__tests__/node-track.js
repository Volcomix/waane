import { expect, test } from '@jest/globals'
import {
  contextMenu,
  findFieldByLabel,
  getSelectOption,
  getSelectOptions,
  setup,
} from '../../testing/helpers'

/** @typedef {import('../../shared/base/select.js').default} Select */

test('is initialized with existing tracks', () => {
  const {
    navigateTo,
    getMenuItem,
    addAudioNode,
    getGraphNodes,
    addAudioTrack,
    getAudioTracks,
  } = setup('Tracks')

  addAudioTrack()
  addAudioTrack()
  const audioTracks = getAudioTracks()
  const [audioTrack1] = audioTracks
  contextMenu(audioTrack1)
  getMenuItem('Delete track').click()

  navigateTo('Nodes')
  addAudioNode('Track')
  const [nodeTrack] = getGraphNodes()
  const trackField = findFieldByLabel(nodeTrack, 'w-select', 'Track')
  trackField.click()

  expect(
    getSelectOptions(trackField).map((option) => option.textContent),
  ).toEqual(['2'])
})

test('updates when adding tracks', () => {
  const { navigateTo, addAudioNode, getGraphNodes, addAudioTrack } = setup(
    'Nodes',
  )
  addAudioNode('Track')
  const [nodeTrack] = getGraphNodes()
  const trackField = /** @type {Select} */ (findFieldByLabel(
    nodeTrack,
    'w-select',
    'Track',
  ))

  trackField.click()
  expect(getSelectOptions(trackField)).toHaveLength(0)
  expect(trackField.value).toBeNull()

  navigateTo('Tracks')
  addAudioTrack()
  navigateTo('Nodes')
  trackField.click()
  expect(
    getSelectOptions(trackField).map((option) => option.textContent),
  ).toEqual(['1'])
  expect(trackField.value).toBeNull()

  trackField.click()
  getSelectOption(trackField, '1').click()
  expect(trackField.value).toBe('1')
})

test('updates when deleting tracks', () => {
  const {
    navigateTo,
    getMenuItem,
    addAudioNode,
    getGraphNodes,
    addAudioTrack,
    getAudioTracks,
  } = setup('Tracks')
  addAudioTrack()
  addAudioTrack()
  addAudioTrack()
  const [audioTrack1, audioTrack2] = getAudioTracks()
  navigateTo('Nodes')
  addAudioNode('Track')
  const [nodeTrack] = getGraphNodes()
  const trackField = /** @type {Select} */ (findFieldByLabel(
    nodeTrack,
    'w-select',
    'Track',
  ))
  trackField.click()
  expect(
    getSelectOptions(trackField).map((option) => option.textContent),
  ).toEqual(['1', '2', '3'])
  expect(trackField.value).toBeNull()

  getSelectOption(trackField, '2').click()
  expect(trackField.value).toBe('2')

  navigateTo('Tracks')
  contextMenu(audioTrack1)
  getMenuItem('Delete track').click()
  navigateTo('Nodes')
  trackField.click()
  expect(
    getSelectOptions(trackField).map((option) => option.textContent),
  ).toEqual(['2', '3'])
  expect(trackField.value).toBe('2')

  navigateTo('Tracks')
  contextMenu(audioTrack2)
  getMenuItem('Delete track').click()
  navigateTo('Nodes')
  trackField.click()
  expect(
    getSelectOptions(trackField).map((option) => option.textContent),
  ).toEqual(['3'])
  expect(trackField.value).toBeNull()
})
