import { jest } from '@jest/globals'
import '../../index'
import { html } from '../../shared/core/element'

const oscillatorMock = {
  type: 'sine',
  frequency: { value: 440 },
  detune: { value: 0 },
  start: jest.fn(),
  stop: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: class {
    destination = {}
    createOscillator = () => oscillatorMock
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
  return [
    .../** @type {NodeListOf<HTMLElement>} */ (element.querySelectorAll(
      selectors,
    )),
  ].find(
    (element) =>
      element.shadowRoot
        .querySelector('w-text-field')
        .shadowRoot.querySelector('label').textContent === label,
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
  element.dispatchEvent(
    new MouseEvent('contextmenu', { bubbles: true, ...eventInitDict }),
  )
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
  return getSelectOptions(element).find(
    (option) => option.textContent === textContent,
  )
}

export function setup() {
  clearOscillatorMock()

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
   * @param {string} [inputLabel]
   */
  function addGraphLink(fromGraphNode, toGraphNode, inputLabel) {
    const graphNodeOutput = fromGraphNode.querySelector('w-graph-node-output')
    const outputSocket = graphNodeOutput.shadowRoot.querySelector(
      'w-graph-node-socket',
    )
    outputSocket.dispatchEvent(new MouseEvent('mousedown'))

    const graphNodeInput = inputLabel
      ? findFieldByLabel(toGraphNode, 'w-number-field', inputLabel).closest(
          'w-graph-node-input',
        )
      : toGraphNode.querySelector('w-graph-node-input')

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
    oscillatorMock,
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
