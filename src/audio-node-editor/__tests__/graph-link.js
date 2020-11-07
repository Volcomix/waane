import { expect, test } from '@jest/globals'
import { click, contextMenu, setup } from '../../testing/helpers'

test('adds a link from an output to an input', () => {
  const { getGraphNodes, addGraphLink, getGraphLinks, addAudioNode } = setup(
    'Nodes',
  )
  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()
  addGraphLink(oscillator, audioDestination)

  expect(getGraphLinks()).toHaveLength(1)
})

test('adds a link from an input to an output', () => {
  const { nodeEditor, getGraphNodes, getGraphLinks, addAudioNode } = setup(
    'Nodes',
  )
  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()

  const graphNodeInput = audioDestination.querySelector('w-graph-node-input')
  const inputSocket = graphNodeInput.shadowRoot.querySelector(
    'w-graph-node-socket',
  )
  const graphNodeOutput = oscillator.querySelector('w-graph-node-output')
  const outputSocket = graphNodeOutput.shadowRoot.querySelector(
    'w-graph-node-socket',
  )
  inputSocket.dispatchEvent(new MouseEvent('mousedown'))
  outputSocket.dispatchEvent(
    new MouseEvent('mousemove', { bubbles: true, composed: true }),
  )
  outputSocket.dispatchEvent(
    new MouseEvent('mouseup', { bubbles: true, composed: true }),
  )
  nodeEditor.click()

  expect(getGraphLinks()).toHaveLength(1)
})

test('cancels adding a link when releasing on node editor', () => {
  const { nodeEditor, getGraphLinks, addAudioNode } = setup('Nodes')
  addAudioNode('Oscillator')

  const graphNodeOutput = nodeEditor.querySelector('w-graph-node-output')
  const outputSocket = graphNodeOutput.shadowRoot.querySelector(
    'w-graph-node-socket',
  )
  outputSocket.dispatchEvent(new MouseEvent('mousedown'))
  nodeEditor.dispatchEvent(new MouseEvent('mousemove'))

  expect(getGraphLinks()).toHaveLength(1)

  nodeEditor.dispatchEvent(new MouseEvent('mouseup'))
  nodeEditor.click()

  expect(getGraphLinks()).toHaveLength(0)
})

test('cancels adding a link if sockets are already linked', () => {
  const { getGraphNodes, addGraphLink, getGraphLinks, addAudioNode } = setup(
    'Nodes',
  )
  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()
  addGraphLink(oscillator, audioDestination)

  expect(getGraphLinks()).toHaveLength(1)

  addGraphLink(oscillator, audioDestination)

  expect(getGraphLinks()).toHaveLength(1)
})

test('deletes links when deleting output node', () => {
  const {
    getGraphNodes,
    addGraphLink,
    getGraphLinks,
    getMenuItem,
    addAudioNode,
  } = setup('Nodes')

  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  addAudioNode('Audio destination')
  const [
    oscillator1,
    oscillator2,
    audioDestination1,
    audioDestination2,
  ] = getGraphNodes()

  addGraphLink(oscillator1, audioDestination1)
  addGraphLink(oscillator2, audioDestination1)
  addGraphLink(oscillator2, audioDestination2)
  const [graphLink1] = getGraphLinks()

  click(oscillator2)
  contextMenu(oscillator2)
  getMenuItem('Delete').click()

  expect(getGraphNodes()).toEqual([
    oscillator1,
    audioDestination1,
    audioDestination2,
  ])
  expect(getGraphLinks()).toEqual([graphLink1])
})

test('deletes links when deleting input node', () => {
  const {
    getGraphNodes,
    addGraphLink,
    getGraphLinks,
    getMenuItem,
    addAudioNode,
  } = setup('Nodes')

  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  addAudioNode('Audio destination')
  const [
    oscillator1,
    oscillator2,
    audioDestination1,
    audioDestination2,
  ] = getGraphNodes()

  addGraphLink(oscillator1, audioDestination1)
  addGraphLink(oscillator1, audioDestination2)
  addGraphLink(oscillator2, audioDestination2)
  const [graphLink1] = getGraphLinks()

  click(audioDestination2)
  contextMenu(audioDestination2)
  getMenuItem('Delete').click()

  expect(getGraphNodes()).toEqual([oscillator1, oscillator2, audioDestination1])
  expect(getGraphLinks()).toEqual([graphLink1])
})

test('duplicates links when duplicating nodes', () => {
  const {
    getGraphNodes,
    addGraphLink,
    getGraphLinks,
    getMenuItem,
    addAudioNode,
  } = setup('Nodes')

  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  addAudioNode('Audio destination')
  const [
    oscillator1,
    oscillator2,
    audioDestination1,
    audioDestination2,
  ] = getGraphNodes()

  addGraphLink(oscillator1, audioDestination1)
  addGraphLink(oscillator2, audioDestination1)
  addGraphLink(oscillator2, audioDestination2)
  const [graphLink1, graphLink2, graphLink3] = getGraphLinks()

  click(oscillator2)
  click(audioDestination1, { ctrlKey: true })
  contextMenu(oscillator2)
  getMenuItem('Duplicate').click()

  expect(getGraphNodes()).toEqual([
    oscillator1,
    oscillator2,
    audioDestination1,
    audioDestination2,
    expect.objectContaining({
      textContent: expect.stringContaining('Oscillator'),
    }),
    expect.objectContaining({
      textContent: expect.stringContaining('Audio destination'),
    }),
  ])
  expect(getGraphLinks()).toEqual([
    graphLink1,
    graphLink2,
    graphLink3,
    expect.anything(),
  ])
})

test('disconnects a link', () => {
  const {
    nodeEditor,
    getGraphNodes,
    addGraphLink,
    getGraphLinks,
    addAudioNode,
  } = setup('Nodes')

  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()

  addGraphLink(oscillator, audioDestination)

  expect(getGraphLinks()).toHaveLength(1)

  const graphNodeInput = audioDestination.querySelector('w-graph-node-input')
  const inputSocket = graphNodeInput.shadowRoot.querySelector(
    'w-graph-node-socket',
  )
  inputSocket.dispatchEvent(new MouseEvent('mousedown'))
  nodeEditor.dispatchEvent(new MouseEvent('mousemove'))

  expect(getGraphLinks()).toHaveLength(1)

  nodeEditor.dispatchEvent(new MouseEvent('mouseup'))
  nodeEditor.click()

  expect(getGraphLinks()).toHaveLength(0)
})

test('disconnects a specific link from a node', () => {
  const {
    nodeEditor,
    getGraphNodes,
    addGraphLink,
    getGraphLinks,
    addAudioNode,
  } = setup('Nodes')

  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator1, oscillator2, audioDestination] = getGraphNodes()

  addGraphLink(oscillator1, audioDestination)
  addGraphLink(oscillator2, audioDestination)

  expect(getGraphLinks()).toHaveLength(2)
  const [graphLink1] = getGraphLinks()

  const graphNodeInput = audioDestination.querySelector('w-graph-node-input')
  const inputSocket = graphNodeInput.shadowRoot.querySelector(
    'w-graph-node-socket',
  )

  inputSocket.dispatchEvent(new MouseEvent('mousedown'))
  inputSocket.dispatchEvent(new MouseEvent('mouseup'))
  nodeEditor.click()

  inputSocket.dispatchEvent(new MouseEvent('mousedown'))
  nodeEditor.dispatchEvent(new MouseEvent('mousemove'))
  nodeEditor.dispatchEvent(new MouseEvent('mouseup'))
  nodeEditor.click()

  expect(getGraphLinks()).toEqual([graphLink1])
})
