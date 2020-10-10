import { expect, test } from '@jest/globals'
import {
  contextMenu,
  findByLabel,
  getSelectOption,
  getSelectOptions,
  setup,
} from './helpers'

test('starts and stops', () => {
  const { oscillatorMock, getGraphNodes, getMenuItem, addAudioNode } = setup()
  addAudioNode('Oscillator')

  expect(oscillatorMock.start).toHaveBeenCalledTimes(1)

  const [oscillator] = getGraphNodes()
  contextMenu(oscillator)
  getMenuItem('Delete').click()

  expect(oscillatorMock.stop).toHaveBeenCalledTimes(1)
})

test('changes type', () => {
  const { oscillatorMock, getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  const [oscillator] = getGraphNodes()
  const typeField = findByLabel(oscillator, 'w-select', 'Type')
  const typeFieldInput = typeField.shadowRoot.querySelector('input')

  expect(typeFieldInput.value).toBe('sine')
  typeField.click()
  expect(
    getSelectOptions(typeField).map((option) => option.textContent),
  ).toEqual(['Sine', 'Square', 'Sawtooth', 'Triangle'])
  document.body.dispatchEvent(new MouseEvent('mousedown'))
  expect(getSelectOptions(typeField)).toHaveLength(0)

  typeField.click()
  getSelectOption(typeField, 'Square').click()
  expect(typeFieldInput.value).toBe('square')
  expect(oscillatorMock.type).toBe('square')

  typeField.click()
  getSelectOption(typeField, 'Sawtooth').click()
  expect(typeFieldInput.value).toBe('sawtooth')
  expect(oscillatorMock.type).toBe('sawtooth')

  typeField.click()
  getSelectOption(typeField, 'Triangle').click()
  expect(typeFieldInput.value).toBe('triangle')
  expect(oscillatorMock.type).toBe('triangle')

  typeField.click()
  getSelectOption(typeField, 'Sine').click()
  expect(typeFieldInput.value).toBe('sine')
  expect(oscillatorMock.type).toBe('sine')
})

test('changes frequency', () => {
  const { oscillatorMock, getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  const [oscillator] = getGraphNodes()
  const frequencyField = findByLabel(oscillator, 'w-number-field', 'Frequency')
  const frequencyFieldInput = frequencyField.shadowRoot.querySelector('input')

  expect(frequencyFieldInput.valueAsNumber).toBe(440)

  frequencyFieldInput.valueAsNumber = 880
  frequencyFieldInput.dispatchEvent(new InputEvent('input', { composed: true }))

  expect(oscillatorMock.frequency.value).toBe(880)
})

test('connects to frequency', () => {
  const { oscillatorMock, getGraphNodes, addGraphLink, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const [oscillator1, oscillator2] = getGraphNodes()
  addGraphLink(oscillator1, oscillator2, 'Frequency')

  expect(oscillatorMock.connect).toHaveBeenCalledTimes(1)
  expect(oscillatorMock.connect).toHaveBeenCalledWith(oscillatorMock.frequency)
})

test('changes detune', () => {
  const { oscillatorMock, getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  const [oscillator] = getGraphNodes()
  const detuneField = findByLabel(oscillator, 'w-number-field', 'Detune')
  const detuneFieldInput = detuneField.shadowRoot.querySelector('input')

  expect(detuneFieldInput.valueAsNumber).toBe(0)

  detuneFieldInput.valueAsNumber = 1
  detuneFieldInput.dispatchEvent(new InputEvent('input', { composed: true }))

  expect(oscillatorMock.detune.value).toBe(1)
})

test('connects to detune', () => {
  const { oscillatorMock, getGraphNodes, addGraphLink, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const [oscillator1, oscillator2] = getGraphNodes()
  addGraphLink(oscillator1, oscillator2, 'Detune')

  expect(oscillatorMock.connect).toHaveBeenCalledTimes(1)
  expect(oscillatorMock.connect).toHaveBeenCalledWith(oscillatorMock.detune)
})
