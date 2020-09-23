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

  /**
   * @returns {NodeListOf<import('../../shared/node-editor/graph-node.js').default>}
   */
  function getGraphNodes() {
    return nodeEditor.querySelectorAll('w-graph-node')
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
   * @returns {NodeListOf<HTMLElement>}
   */
  function getMenuItems() {
    return audioNodeEditor.shadowRoot.querySelectorAll(
      'w-menu[open] w-menu-item',
    )
  }

  /**
   * @param {string} audioNodeName
   */
  function addAudioNode(audioNodeName) {
    nodeEditor.dispatchEvent(new MouseEvent('contextmenu'))
    const menuItem = [...getMenuItems()].find(
      (element) => element.textContent === audioNodeName,
    )
    menuItem.click()
    nodeEditor.dispatchEvent(new MouseEvent('mousedown'))
    nodeEditor.dispatchEvent(new MouseEvent('mouseup'))
    nodeEditor.click()
  }

  return {
    nodeEditor,
    getGraphNodes,
    moveGraphNode,
    getMenuItems,
    addAudioNode,
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

test('has no node by default', () => {
  const { getGraphNodes } = setup()
  expect(getGraphNodes()).toHaveLength(0)
})

test('opens context menu on node editor', () => {
  const { nodeEditor, getMenuItems } = setup()
  nodeEditor.dispatchEvent(new MouseEvent('contextmenu'))
  expect([...getMenuItems()].map((menuItem) => menuItem.textContent)).toEqual([
    'Oscillator',
  ])
  document.body.dispatchEvent(new MouseEvent('mousedown'))
  expect(getMenuItems()).toHaveLength(0)
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

  graphNode1.dispatchEvent(
    new MouseEvent('click', { ctrlKey: true, bubbles: true }),
  )
  graphNode2.dispatchEvent(
    new MouseEvent('click', { ctrlKey: true, bubbles: true }),
  )
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

  graphNode1.dispatchEvent(
    new MouseEvent('click', { ctrlKey: true, bubbles: true }),
  )
  graphNode2.dispatchEvent(
    new MouseEvent('click', { ctrlKey: true, bubbles: true }),
  )
  graphNode1.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }))

  expect([...getMenuItems()].map((menuItem) => menuItem.textContent)).toEqual([
    'Delete',
  ])
  expect(graphNode1.selected).toBe(true)
  expect(graphNode2.selected).toBe(true)
  expect(graphNode3.selected).toBe(false)

  graphNode3.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }))

  expect([...getMenuItems()].map((menuItem) => menuItem.textContent)).toEqual([
    'Delete',
  ])
  expect(graphNode1.selected).toBe(false)
  expect(graphNode2.selected).toBe(false)
  expect(graphNode3.selected).toBe(true)

  graphNode2.dispatchEvent(
    new MouseEvent('contextmenu', { ctrlKey: true, bubbles: true }),
  )

  expect([...getMenuItems()].map((menuItem) => menuItem.textContent)).toEqual([
    'Delete',
  ])
  expect(graphNode1.selected).toBe(false)
  expect(graphNode2.selected).toBe(true)
  expect(graphNode3.selected).toBe(true)

  document.body.dispatchEvent(new MouseEvent('mousedown'))

  expect(getMenuItems()).toHaveLength(0)
})
