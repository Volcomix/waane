import { afterEach, expect, jest, test } from '@jest/globals'
import '../../index'
import { html } from '../../shared/core/element'

const handleAudioNodeStart = jest.fn()
const handleAudioNodeStop = jest.fn()
const handleAudioNodeConnect = jest.fn()
const handleAudioNodeDisconnect = jest.fn()

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: class {
    destination = {}

    createOscillator() {
      return {
        start: handleAudioNodeStart,
        stop: handleAudioNodeStop,
        connect: handleAudioNodeConnect,
        disconnect: handleAudioNodeDisconnect,
      }
    }
  },
})

/**
 * @param {HTMLElement} element
 * @param {MouseEventInit} eventInitDict
 */
function click(element, eventInitDict = {}) {
  const commonEventInitDict = { bubbles: true, ...eventInitDict }
  element.dispatchEvent(new MouseEvent('mousedown', commonEventInitDict))
  element.dispatchEvent(new MouseEvent('mouseup', commonEventInitDict))
  element.dispatchEvent(new MouseEvent('click', commonEventInitDict))
}

/**
 * @param {HTMLElement} element
 * @param {MouseEventInit} eventInitDict
 */
function contextMenu(element, eventInitDict = {}) {
  element.dispatchEvent(
    new MouseEvent('contextmenu', { bubbles: true, ...eventInitDict }),
  )
}

function setup() {
  document.body.innerHTML = html`<audio-node-editor></audio-node-editor>`
  const audioNodeEditor = /** @type {HTMLElement} */ (document.body.querySelector(
    'audio-node-editor',
  ))
  const nodeEditor = /** @type {HTMLElement} */ (audioNodeEditor.shadowRoot.querySelector(
    'w-node-editor',
  ))

  function getGraphNodes() {
    return [
      .../** @type {NodeListOf<import('../../shared/node-editor/graph-node.js').default>} */ (nodeEditor.querySelectorAll(
        'w-graph-node',
      )),
    ]
  }

  /**
   * @param {HTMLElement} graphNode
   * @param {number} movementX
   * @param {number} movementY
   * @param {boolean} [ctrlKey]
   */
  function moveGraphNode(graphNode, movementX, movementY, ctrlKey = false) {
    graphNode.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    nodeEditor.dispatchEvent(
      Object.assign(new MouseEvent('mousemove', { ctrlKey }), {
        movementX,
        movementY,
      }),
    )
    nodeEditor.dispatchEvent(new MouseEvent('mouseup'))
    nodeEditor.dispatchEvent(new MouseEvent('click'))
  }

  /**
   * @param {HTMLElement} fromGraphNode
   * @param {HTMLElement} toGraphNode
   */
  function addGraphLink(fromGraphNode, toGraphNode) {
    const graphNodeOutput = fromGraphNode.querySelector('w-graph-node-output')
    const outputSocket = graphNodeOutput.shadowRoot.querySelector(
      'w-graph-node-socket',
    )
    outputSocket.dispatchEvent(new MouseEvent('mousedown'))

    const graphNodeInput = toGraphNode.querySelector('w-graph-node-input')
    const inputSocket = graphNodeInput.shadowRoot.querySelector(
      'w-graph-node-socket',
    )
    inputSocket.dispatchEvent(
      new MouseEvent('mousemove', { bubbles: true, composed: true }),
    )
    inputSocket.dispatchEvent(
      new MouseEvent('mouseup', { bubbles: true, composed: true }),
    )
    nodeEditor.click()
  }

  function getGraphLinks() {
    return [...nodeEditor.querySelectorAll('w-graph-link')]
  }

  function getMenuItems() {
    return [
      .../** @type {NodeListOf<HTMLElement>} */ (audioNodeEditor.shadowRoot.querySelectorAll(
        'w-menu[open] w-menu-item',
      )),
    ]
  }

  /**
   * @param {string} textContent
   */
  function getMenuItem(textContent) {
    return getMenuItems().find((element) =>
      element.textContent.includes(textContent),
    )
  }

  /**
   * @param {string} audioNodeName
   */
  function addAudioNode(audioNodeName) {
    contextMenu(nodeEditor)
    getMenuItem(audioNodeName).click()
    nodeEditor.dispatchEvent(new MouseEvent('mousemove'))
    click(nodeEditor)
  }

  return {
    nodeEditor,
    getGraphNodes,
    moveGraphNode,
    addGraphLink,
    getGraphLinks,
    getMenuItems,
    getMenuItem,
    addAudioNode,
  }
}

afterEach(() => {
  document.body.innerHTML = ''
  handleAudioNodeStart.mockClear()
  handleAudioNodeStop.mockClear()
  handleAudioNodeConnect.mockClear()
  handleAudioNodeDisconnect.mockClear()
})

test('has no node by default', () => {
  const { getGraphNodes } = setup()
  expect(getGraphNodes()).toHaveLength(0)
})

test('opens context menu on node editor', () => {
  const { nodeEditor, getMenuItems } = setup()
  contextMenu(nodeEditor)
  expect(getMenuItems().map((menuItem) => menuItem.textContent)).toEqual([
    'Oscillator',
    'Audio destination',
  ])
  document.body.dispatchEvent(new MouseEvent('mousedown'))
  expect(getMenuItems()).toHaveLength(0)
})

test('adds an oscillator node', () => {
  const { getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  expect(getGraphNodes()).toEqual([
    expect.objectContaining({
      textContent: expect.stringContaining('Oscillator'),
      selected: true,
    }),
  ])
})

test('adds an audio destination node', () => {
  const { getGraphNodes, addAudioNode } = setup()
  addAudioNode('Audio destination')
  expect(getGraphNodes()).toEqual([
    expect.objectContaining({
      textContent: expect.stringContaining('Audio destination'),
      selected: true,
    }),
  ])
})

test('selects nodes', () => {
  const { nodeEditor, getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const [graphNode1, graphNode2] = getGraphNodes()

  graphNode1.click()

  expect(graphNode1.selected).toBe(true)
  expect(graphNode2.selected).toBe(false)

  nodeEditor.click()

  expect(graphNode1.selected).toBe(false)
  expect(graphNode2.selected).toBe(false)
})

test('inverts node selection', () => {
  const { getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const [graphNode1, graphNode2] = getGraphNodes()

  click(graphNode1)

  expect(graphNode1.selected).toBe(true)
  expect(graphNode2.selected).toBe(false)

  click(graphNode2, { ctrlKey: true })

  expect(graphNode1.selected).toBe(true)
  expect(graphNode2.selected).toBe(true)

  click(graphNode1, { ctrlKey: true })

  expect(graphNode1.selected).toBe(false)
  expect(graphNode2.selected).toBe(true)
})

test('moves nodes', () => {
  const { getGraphNodes, moveGraphNode, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const [graphNode1, graphNode2, graphNode3] = getGraphNodes()
  graphNode1.x = 0
  graphNode1.y = 0
  graphNode2.x = 10
  graphNode2.y = 10
  graphNode3.x = 20
  graphNode3.y = 20

  click(graphNode1)
  click(graphNode2, { ctrlKey: true })
  moveGraphNode(graphNode1, 5, 5)

  expect(graphNode1).toMatchObject({ x: 5, y: 5, selected: true })
  expect(graphNode2).toMatchObject({ x: 15, y: 15, selected: true })
  expect(graphNode3).toMatchObject({ x: 20, y: 20, selected: false })

  moveGraphNode(graphNode3, 10, 10)

  expect(graphNode1).toMatchObject({ x: 5, y: 5, selected: false })
  expect(graphNode2).toMatchObject({ x: 15, y: 15, selected: false })
  expect(graphNode3).toMatchObject({ x: 30, y: 30, selected: true })

  moveGraphNode(graphNode2, 20, 20, true)

  expect(graphNode1).toMatchObject({ x: 5, y: 5, selected: false })
  expect(graphNode2).toMatchObject({ x: 35, y: 35, selected: true })
  expect(graphNode3).toMatchObject({ x: 50, y: 50, selected: true })
})

test('opens context menu on selected nodes', () => {
  const { getGraphNodes, getMenuItems, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const [graphNode1, graphNode2, graphNode3] = getGraphNodes()

  const expectedMenuItems = ['Duplicate', 'Delete'].map((menuItem) =>
    expect.objectContaining({ textContent: expect.stringContaining(menuItem) }),
  )

  click(graphNode1)
  click(graphNode2, { ctrlKey: true })
  contextMenu(graphNode1)

  expect(getMenuItems()).toEqual(expectedMenuItems)
  expect(graphNode1.selected).toBe(true)
  expect(graphNode2.selected).toBe(true)
  expect(graphNode3.selected).toBe(false)

  contextMenu(graphNode3)

  expect(getMenuItems()).toEqual(expectedMenuItems)
  expect(graphNode1.selected).toBe(false)
  expect(graphNode2.selected).toBe(false)
  expect(graphNode3.selected).toBe(true)

  contextMenu(graphNode2, { ctrlKey: true })

  expect(getMenuItems()).toEqual(expectedMenuItems)
  expect(graphNode1.selected).toBe(false)
  expect(graphNode2.selected).toBe(true)
  expect(graphNode3.selected).toBe(true)

  document.body.dispatchEvent(new MouseEvent('mousedown'))

  expect(getMenuItems()).toHaveLength(0)
})

test('duplicates nodes', () => {
  const { nodeEditor, getGraphNodes, getMenuItem, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const graphNodes = getGraphNodes()
  const [graphNode1, graphNode2] = graphNodes

  expect(graphNodes).toHaveLength(3)

  click(graphNode1)
  click(graphNode2, { ctrlKey: true })
  contextMenu(graphNode1)
  getMenuItem('Duplicate').click()
  nodeEditor.dispatchEvent(new MouseEvent('mousemove'))
  click(nodeEditor)

  expect(getGraphNodes()).toEqual([
    expect.objectContaining({ selected: false }),
    expect.objectContaining({ selected: false }),
    expect.objectContaining({ selected: false }),
    expect.objectContaining({ selected: true }),
    expect.objectContaining({ selected: true }),
  ])
})

test('deletes nodes', () => {
  const { getGraphNodes, getMenuItem, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const graphNodes = getGraphNodes()
  const [graphNode1, graphNode2, graphNode3] = graphNodes

  expect(graphNodes).toHaveLength(3)

  click(graphNode1)
  click(graphNode2, { ctrlKey: true })
  contextMenu(graphNode1)
  getMenuItem('Delete').click()

  const remainingGraphNodes = getGraphNodes()
  expect(remainingGraphNodes).toHaveLength(1)
  expect(remainingGraphNodes[0]).toBe(graphNode3)
})

test('cancels adding a link', () => {
  const { nodeEditor, getGraphLinks, addAudioNode } = setup()
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

test('adds a link from an output to an input', () => {
  const { getGraphNodes, addGraphLink, getGraphLinks, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()
  addGraphLink(oscillator, audioDestination)

  expect(getGraphLinks()).toHaveLength(1)
})

test('adds a link from an input to an output', () => {
  const { nodeEditor, getGraphNodes, getGraphLinks, addAudioNode } = setup()
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

test('deletes links when deleting output node', () => {
  const {
    getGraphNodes,
    addGraphLink,
    getGraphLinks,
    getMenuItem,
    addAudioNode,
  } = setup()

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
  } = setup()

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
  } = setup()

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
  } = setup()

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
  } = setup()

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

test('starts and stops oscillator', () => {
  const { getGraphNodes, getMenuItem, addAudioNode } = setup()
  addAudioNode('Oscillator')

  expect(handleAudioNodeStart).toHaveBeenCalledTimes(1)

  const [oscillator] = getGraphNodes()
  contextMenu(oscillator)
  getMenuItem('Delete').click()

  expect(handleAudioNodeStop).toHaveBeenCalledTimes(1)
})

test('connects oscillator to audio destination', () => {
  const { getGraphNodes, addGraphLink, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Audio destination')
  const [oscillator, audioDestination] = getGraphNodes()
  addGraphLink(oscillator, audioDestination)

  expect(handleAudioNodeConnect).toHaveBeenCalledTimes(1)
})
