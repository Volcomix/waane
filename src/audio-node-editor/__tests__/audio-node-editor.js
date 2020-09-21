import { afterEach, expect, test } from '@jest/globals'
import '../../index'
import { html } from '../../shared/core/element'

function setup() {
  document.body.innerHTML = html`<audio-node-editor></audio-node-editor>`
  const audioNodeEditor = /** @type {HTMLElement} */ (document.body.querySelector(
    'audio-node-editor',
  ))
  const nodeEditor = /** @type {HTMLElement} */ (audioNodeEditor.shadowRoot.querySelector(
    'w-node-editor',
  ))
  return {
    nodeEditor,

    getGraphNodes: () =>
      /** @type {NodeListOf<import('../../shared/node-editor/graph-node.js').default>} */ (nodeEditor.querySelectorAll(
        'w-graph-node',
      )),

    /**
     * @param {string} audioNodeName
     */
    addAudioNode: (audioNodeName) => {
      nodeEditor.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }))
      const menuItem = /** @type {HTMLElement} */ ([
        ...audioNodeEditor.shadowRoot.querySelectorAll(
          'w-menu[open] w-menu-item',
        ),
      ].find((element) => element.textContent === audioNodeName))
      menuItem.click()
      nodeEditor.click()
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

test('moves nodes', () => {
  const { nodeEditor, getGraphNodes, addAudioNode } = setup()
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

  graphNode1.dispatchEvent(
    new MouseEvent('click', { ctrlKey: true, bubbles: true }),
  )
  graphNode2.dispatchEvent(
    new MouseEvent('click', { ctrlKey: true, bubbles: true }),
  )

  graphNode1.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  nodeEditor.dispatchEvent(
    Object.assign(new MouseEvent('mousemove'), { movementX: 5, movementY: 5 }),
  )
  nodeEditor.dispatchEvent(new MouseEvent('mouseup'))

  expect(graphNode1).toMatchObject({ x: 5, y: 5 })
  expect(graphNode2).toMatchObject({ x: 15, y: 15 })
  expect(graphNode3).toMatchObject({ x: 20, y: 20 })
})
