import { expect, test } from '@jest/globals'
import { click, contextMenu, setup } from './helpers'

test('connects and disconnects audio nodes', () => {
  const {
    handleAudioNodeConnect,
    handleAudioNodeDisconnect,
    nodeEditor,
    getGraphNodes,
    addGraphLink,
    addAudioNode,
  } = setup()

  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()
  addGraphLink(oscillator, audioDestination)

  expect(handleAudioNodeConnect).toHaveBeenCalledTimes(1)

  const graphNodeInput = audioDestination.querySelector('w-graph-node-input')
  const inputSocket = graphNodeInput.shadowRoot.querySelector(
    'w-graph-node-socket',
  )
  inputSocket.dispatchEvent(new MouseEvent('mousedown'))
  nodeEditor.dispatchEvent(new MouseEvent('mousemove'))

  expect(handleAudioNodeDisconnect).toHaveBeenCalledTimes(1)
})

test('disconnects audio nodes when deleting output node', () => {
  const {
    handleAudioNodeDisconnect,
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

  expect(handleAudioNodeDisconnect).toHaveBeenCalledTimes(1)
})

test('disconnects audio nodes when deleting input node', () => {
  const {
    handleAudioNodeDisconnect,
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

  expect(handleAudioNodeDisconnect).toHaveBeenCalledTimes(1)
})

test('connects linked audio nodes when duplicating them', () => {
  const {
    handleAudioNodeConnect,
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

  expect(handleAudioNodeConnect).toHaveBeenCalledTimes(2)
  handleAudioNodeConnect.mockClear()

  click(oscillator1)
  click(audioDestination1, { ctrlKey: true })
  contextMenu(oscillator1)
  getMenuItem('Duplicate').click()

  expect(handleAudioNodeConnect).toHaveBeenCalledTimes(1)
  handleAudioNodeConnect.mockClear()

  click(oscillator2)
  click(audioDestination2, { ctrlKey: true })
  contextMenu(oscillator2)
  getMenuItem('Duplicate').click()

  expect(handleAudioNodeConnect).toHaveBeenCalledTimes(1)
})
