import { expect, test } from '@jest/globals'
import { contextMenu, setup } from './helpers'

test('starts and stops', () => {
  const { oscillatorMock, getGraphNodes, getMenuItem, addAudioNode } = setup()
  addAudioNode('Oscillator')

  expect(oscillatorMock.start).toHaveBeenCalledTimes(1)

  const [oscillator] = getGraphNodes()
  contextMenu(oscillator)
  getMenuItem('Delete').click()

  expect(oscillatorMock.stop).toHaveBeenCalledTimes(1)
})

test('changes frequency', () => {
  const { oscillatorMock, getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  const [oscillator] = getGraphNodes()
  const frequencyFieldInput = oscillator
    .querySelector(`w-number-field[label='Frequency']`)
    .shadowRoot.querySelector('input')

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
  const detuneFieldInput = oscillator
    .querySelector(`w-number-field[label='Detune']`)
    .shadowRoot.querySelector('input')

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
