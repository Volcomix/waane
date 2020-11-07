import { expect, test } from '@jest/globals'
import { click, contextMenu, setup } from '../../testing/helpers'

test('connects and disconnects audio nodes', () => {
  const {
    oscillatorMock,
    nodeEditor,
    getGraphNodes,
    addGraphLink,
    addAudioNode,
  } = setup()

  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()
  addGraphLink(oscillator, audioDestination)

  expect(oscillatorMock.connect).toHaveBeenCalledTimes(1)

  const graphNodeInput = audioDestination.querySelector('w-graph-node-input')
  const inputSocket = graphNodeInput.shadowRoot.querySelector(
    'w-graph-node-socket',
  )
  inputSocket.dispatchEvent(new MouseEvent('mousedown'))
  nodeEditor.dispatchEvent(new MouseEvent('mousemove'))

  expect(oscillatorMock.disconnect).toHaveBeenCalledTimes(1)
})

test('disconnects audio nodes when deleting output node', () => {
  const {
    oscillatorMock,
    getGraphNodes,
    addGraphLink,
    getMenuItem,
    addAudioNode,
  } = setup()

  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()
  addGraphLink(oscillator, audioDestination)

  contextMenu(oscillator)
  getMenuItem('Delete').click()

  expect(oscillatorMock.disconnect).toHaveBeenCalledTimes(1)
})

test('disconnects audio nodes when deleting input node', () => {
  const {
    oscillatorMock,
    getGraphNodes,
    addGraphLink,
    getMenuItem,
    addAudioNode,
  } = setup()

  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()
  addGraphLink(oscillator, audioDestination)

  contextMenu(audioDestination)
  getMenuItem('Delete').click()

  expect(oscillatorMock.disconnect).toHaveBeenCalledTimes(1)
})

test('connects linked audio nodes when duplicating them', () => {
  const {
    oscillatorMock,
    getGraphNodes,
    addGraphLink,
    getMenuItem,
    addAudioNode,
  } = setup()

  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  addAudioNode('Audio destination')
  addAudioNode('Oscillator')
  const [
    oscillator1,
    audioDestination1,
    audioDestination2,
    oscillator2,
  ] = getGraphNodes()

  addGraphLink(oscillator1, audioDestination1)
  addGraphLink(oscillator2, audioDestination2)

  expect(oscillatorMock.connect).toHaveBeenCalledTimes(2)
  oscillatorMock.connect.mockClear()

  click(oscillator1)
  click(audioDestination1, { ctrlKey: true })
  contextMenu(oscillator1)
  getMenuItem('Duplicate').click()

  expect(oscillatorMock.connect).toHaveBeenCalledTimes(1)
  oscillatorMock.connect.mockClear()

  click(oscillator2)
  click(audioDestination2, { ctrlKey: true })
  contextMenu(oscillator2)
  getMenuItem('Duplicate').click()

  expect(oscillatorMock.connect).toHaveBeenCalledTimes(1)
})
