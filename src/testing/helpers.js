import { jest } from '@jest/globals'
import '../index'
import { html } from '../shared/core/element'
import { clearAllIds } from '../shared/helpers/id'

/**
 * @typedef {import('../shared/node-editor/graph-node.js').default} GraphNode
 * @typedef {import('../audio-tracker/audio-tracker.js').default} AudioTracker
 * @typedef {import('../audio-tracker/audio-track.js').default} AudioTrack
 */

jest.useFakeTimers()

const oscillatorMock = {
  type: 'sine',
  frequency: { value: 440 },
  detune: { value: 0 },
  start: jest.fn(),
  stop: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}

const constantSourceMock = {
  offset: { value: 1 },
  start: jest.fn(),
  stop: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}

const bufferSourceMock = {
  start: jest.fn(),
  stop: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}

/**
 * @param {number} numberOfChannels
 * @param {number} length
 * @param {number} sampleRate
 */
function bufferMock(numberOfChannels, length, sampleRate) {
  const channels = Array.from({ length: numberOfChannels }, () => new Float32Array(length))
  return {
    numberOfChannels,
    length,
    sampleRate,
    getChannelData: jest.fn((/** @type {number} */ channel) => channels[channel]),
  }
}

const gainMock = {
  gain: { value: 0 },
  connect: jest.fn(),
  disconnect: jest.fn(),
}

const biquadFilterMock = {
  type: 'lowpass',
  frequency: { value: 350 },
  detune: { value: 0 },
  Q: { value: 1 },
  gain: { value: 0 },
  connect: jest.fn(),
  disconnect: jest.fn(),
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: class {
    destination = {}
    createOscillator = () => oscillatorMock
    createConstantSource = () => constantSourceMock
    createBufferSource = () => bufferSourceMock
    createBuffer = bufferMock
    createGain = () => gainMock
    createBiquadFilter = () => biquadFilterMock
    createAnalyser = jest.fn()
  },
})

function clearOscillatorMock() {
  oscillatorMock.start.mockClear()
  oscillatorMock.stop.mockClear()
  oscillatorMock.connect.mockClear()
  oscillatorMock.disconnect.mockClear()
}

/**
 * @param {HTMLElement} element
 * @param {string} selectors
 * @param {string} label
 */
export function findFieldByLabel(element, selectors, label) {
  return [.../** @type {NodeListOf<HTMLElement>} */ (element.querySelectorAll(selectors))].find(
    (element) =>
      element.shadowRoot.querySelector('w-text-field').shadowRoot.querySelector('label').textContent === label,
  )
}

/**
 * @param {HTMLElement} element
 * @param {string} selectors
 * @param {string} label
 */
export function findFieldInputByLabel(element, selectors, label) {
  return findFieldByLabel(element, selectors, label)
    .shadowRoot.querySelector('w-text-field')
    .shadowRoot.querySelector('input')
}

/**
 * @param {HTMLElement} element
 * @param {MouseEventInit} eventInitDict
 */
export function click(element, eventInitDict = {}) {
  const commonEventInitDict = { bubbles: true, ...eventInitDict }
  element.dispatchEvent(new MouseEvent('mousedown', commonEventInitDict))
  element.dispatchEvent(new MouseEvent('mouseup', commonEventInitDict))
  element.dispatchEvent(new MouseEvent('click', commonEventInitDict))
}

/**
 * @param {HTMLElement} element
 * @param {MouseEventInit} eventInitDict
 */
export function contextMenu(element, eventInitDict = {}) {
  element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, ...eventInitDict }))
}

/**
 * @param {HTMLElement} element
 */
export function getSelectOptions(element) {
  if (!element.shadowRoot.querySelector('w-menu[open]')) {
    return []
  }
  return /** @type {HTMLElement[]} */ (element.shadowRoot
    .querySelector('slot')
    .assignedElements()
    .filter((assignedElement) => assignedElement.matches('w-menu-item')))
}

/**
 * @param {HTMLElement} element
 * @param {string} textContent
 */
export function getSelectOption(element, textContent) {
  return getSelectOptions(element).find((option) => option.textContent === textContent)
}

/**
 * @param {'Tracks' | 'Nodes'} initialTabTextContent
 */
export function setup(initialTabTextContent) {
  clearAllIds()
  clearOscillatorMock()

  document.body.innerHTML = html`<waane-app></waane-app>`
  const waaneApp = document.body.querySelector('waane-app')
  const tabs = [.../** @type {NodeListOf<HTMLElement>} */ (waaneApp.shadowRoot.querySelectorAll('w-tab'))]

  /** @type {HTMLElement} */
  const audioNodeEditor = waaneApp.shadowRoot.querySelector('audio-node-editor')

  /** @type {HTMLElement} */
  const nodeEditor = audioNodeEditor.shadowRoot.querySelector('w-node-editor')

  /** @type {AudioTracker} */
  const audioTracker = waaneApp.shadowRoot.querySelector('audio-tracker')

  /** @type {HTMLElement} */
  const addButton = audioTracker.shadowRoot.querySelector('w-fab')

  /**
   * @param {'Tracks' | 'Nodes'} tabTextContent
   */
  function navigateTo(tabTextContent) {
    tabs.find((tab) => tab.textContent === tabTextContent).click()
    jest.runOnlyPendingTimers()
  }

  function getMenuItems() {
    const view = waaneApp.shadowRoot.querySelector('main > [active]')
    return [.../** @type {NodeListOf<HTMLElement>} */ (view.shadowRoot.querySelectorAll('w-menu[open] w-menu-item'))]
  }

  /**
   * @param {string} textContent
   */
  function getMenuItem(textContent) {
    return getMenuItems().find((menuItem) => menuItem.textContent.includes(textContent))
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

  function getGraphNodes() {
    return [.../** @type {NodeListOf<GraphNode>} */ (nodeEditor.querySelectorAll('w-graph-node'))]
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
   * @param {string} [inputLabel]
   */
  function addGraphLink(fromGraphNode, toGraphNode, inputLabel) {
    const graphNodeOutput = fromGraphNode.querySelector('w-graph-node-output')
    const outputSocket = graphNodeOutput.shadowRoot.querySelector('w-graph-node-socket')
    outputSocket.dispatchEvent(new MouseEvent('mousedown'))

    const graphNodeInput = inputLabel
      ? findFieldByLabel(toGraphNode, 'w-number-field', inputLabel).closest('w-graph-node-input')
      : toGraphNode.querySelector('w-graph-node-input')

    const inputSocket = graphNodeInput.shadowRoot.querySelector('w-graph-node-socket')
    inputSocket.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, composed: true }))
    inputSocket.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, composed: true }))
    nodeEditor.click()
  }

  function getGraphLinks() {
    return [...nodeEditor.querySelectorAll('w-graph-link')]
  }

  function addAudioTrack() {
    addButton.click()
  }

  function getAudioTracks() {
    return [.../** @type {NodeListOf<AudioTrack>} */ (audioTracker.shadowRoot.querySelectorAll('audio-track'))]
  }

  navigateTo(initialTabTextContent)

  return {
    oscillatorMock,
    constantSourceMock,
    gainMock,
    biquadFilterMock,

    nodeEditor,
    audioNodeEditor,
    audioTracker,

    navigateTo,

    getMenuItems,
    getMenuItem,

    addAudioNode,
    getGraphNodes,
    moveGraphNode,

    addGraphLink,
    getGraphLinks,

    addAudioTrack,
    getAudioTracks,
  }
}
