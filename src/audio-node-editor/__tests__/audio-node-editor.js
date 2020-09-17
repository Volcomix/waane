import { afterEach, expect, test } from '@jest/globals'
import '../../index'
import { html } from '../../shared/core/element'

function setup() {
  document.body.innerHTML = html`<audio-node-editor></audio-node-editor>`
  const audioNodeEditor = document.body.querySelector('audio-node-editor')
  const graph = audioNodeEditor.shadowRoot.querySelector('w-graph')

  return {
    audioNodeEditor,

    getGraphNode: () =>
      /** @type {import('../../shared/node-editor/graph-node.js').default} */ (audioNodeEditor.shadowRoot.querySelector(
        'w-graph-node',
      )),

    /**
     * @param {string} audioNodeName
     */
    addAudioNode: (audioNodeName) => {
      graph.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }))
      const menuItem = /** @type {HTMLElement} */ ([
        ...audioNodeEditor.shadowRoot.querySelectorAll(
          'w-menu[open] w-menu-item',
        ),
      ].find((element) => element.textContent === audioNodeName))
      menuItem.click()
    },
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

test('has no node by default', () => {
  const { getGraphNode } = setup()
  expect(getGraphNode()).toBeNull()
})

test('adds an oscillator node', () => {
  const { getGraphNode, addAudioNode } = setup()
  addAudioNode('Oscillator')
  expect(getGraphNode().textContent).toBe('Oscillator')
})

test('selects a single node', () => {
  const { getGraphNode, addAudioNode } = setup()
  addAudioNode('Oscillator')
  const graphNode = getGraphNode()
  graphNode.click()
  expect(graphNode.selected).toBe(true)
})
