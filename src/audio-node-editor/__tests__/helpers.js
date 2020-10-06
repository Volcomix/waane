import { jest } from '@jest/globals'
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
        frequency: {},
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

export function setup() {
  handleAudioNodeStart.mockClear()
  handleAudioNodeStop.mockClear()
  handleAudioNodeConnect.mockClear()
  handleAudioNodeDisconnect.mockClear()

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
    handleAudioNodeStart,
    handleAudioNodeStop,
    handleAudioNodeConnect,
    handleAudioNodeDisconnect,
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
