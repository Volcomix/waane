import { expect, test } from '@jest/globals'
import {
  contextMenu,
  findFieldByLabel,
  getSelectOption,
  getSelectOptions,
  setup,
} from '../../testing/helpers'

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
  const trackField = /** @type {import('../../shared/base/select.js').default} */ (findFieldByLabel(
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
