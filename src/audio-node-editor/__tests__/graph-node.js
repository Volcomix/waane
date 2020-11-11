import { expect, test } from '@jest/globals'
import { click, contextMenu, setup } from '../../testing/helpers'

test('selects nodes', () => {
  const { nodeEditor, addAudioNode, getGraphNodes } = setup('Nodes')
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
  const { addAudioNode, getGraphNodes } = setup('Nodes')
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
  const { addAudioNode, getGraphNodes, moveGraphNode } = setup('Nodes')
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
  const { getMenuItems, addAudioNode, getGraphNodes } = setup('Nodes')
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
  const { nodeEditor, getMenuItem, addAudioNode, getGraphNodes } = setup('Nodes')
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
  const { getMenuItem, addAudioNode, getGraphNodes } = setup('Nodes')
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
