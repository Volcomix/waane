import { afterEach, expect, test } from '@jest/globals'
import '../../index'
import { html } from '../../shared/core/element'

function setup() {
  document.body.innerHTML = html`<audio-node-editor></audio-node-editor>`
  const audioNodeEditor = document.body.querySelector('audio-node-editor')
  const graph = /** @type {HTMLElement} */ (audioNodeEditor.shadowRoot.querySelector(
    'w-graph',
  ))

  return {
    audioNodeEditor,
    graph,

    getGraphNodes: () =>
      /** @type {NodeListOf<import('../../shared/node-editor/graph-node.js').default>} */ (audioNodeEditor.shadowRoot.querySelectorAll(
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
  const { getGraphNodes } = setup()
  expect(getGraphNodes()).toHaveLength(0)
})

test('adds an oscillator node', () => {
  const { getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  expect([...getGraphNodes()]).toEqual([
    expect.objectContaining({ textContent: 'Oscillator' }),
  ])
})

test('selects nodes', () => {
  const { graph, getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const [graphNode1, graphNode2] = getGraphNodes()

  graphNode1.click()

  expect(graphNode1.selected).toBe(true)
  expect(graphNode2.selected).toBe(false)

  graph.click()

  expect(graphNode1.selected).toBe(false)
  expect(graphNode2.selected).toBe(false)
})

test('inverts node selection', () => {
  const { graph, getGraphNodes, addAudioNode } = setup()
  addAudioNode('Oscillator')
  addAudioNode('Oscillator')
  const [graphNode1, graphNode2] = getGraphNodes()

  graphNode1.dispatchEvent(
    new MouseEvent('click', { ctrlKey: true, bubbles: true }),
  )

  expect(graphNode1.selected).toBe(true)
  expect(graphNode2.selected).toBe(false)

  graphNode2.dispatchEvent(
    new MouseEvent('click', { ctrlKey: true, bubbles: true }),
  )

  expect(graphNode1.selected).toBe(true)
  expect(graphNode2.selected).toBe(true)

  graphNode1.dispatchEvent(
    new MouseEvent('click', { ctrlKey: true, bubbles: true }),
  )

  expect(graphNode1.selected).toBe(false)
  expect(graphNode2.selected).toBe(true)
})
