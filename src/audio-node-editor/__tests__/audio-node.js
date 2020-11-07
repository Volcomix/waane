import { expect, test } from '@jest/globals'
import {
  click,
  contextMenu,
  findFieldByLabel,
  findFieldInputByLabel,
  getSelectOption,
  setup,
} from '../../testing/helpers'

test('has no node by default', () => {
  const { getGraphNodes } = setup('Nodes')
  expect(getGraphNodes()).toHaveLength(0)
})

test('opens context menu on node editor', () => {
  const { nodeEditor, getMenuItems } = setup('Nodes')
  contextMenu(nodeEditor)
  expect(getMenuItems().map((menuItem) => menuItem.textContent)).toEqual([
    expect.stringContaining('Track'),
    expect.stringContaining('Schedule'),
    expect.stringContaining('Oscillator'),
    expect.stringContaining('Constant'),
    expect.stringContaining('Gain'),
    expect.stringContaining('Biquad filter'),
    expect.stringContaining('Audio destination'),
  ])
  document.body.dispatchEvent(new MouseEvent('mousedown'))
  expect(getMenuItems()).toHaveLength(0)
})

test('adds an oscillator node', () => {
  const { addAudioNode, getGraphNodes } = setup('Nodes')
  addAudioNode('Oscillator')
  expect(getGraphNodes()).toEqual([
    expect.objectContaining({
      textContent: expect.stringContaining('Oscillator'),
      selected: true,
    }),
  ])
})

test('adds an audio destination node', () => {
  const { addAudioNode, getGraphNodes } = setup('Nodes')
  addAudioNode('Audio destination')
  expect(getGraphNodes()).toEqual([
    expect.objectContaining({
      textContent: expect.stringContaining('Audio destination'),
      selected: true,
    }),
  ])
})

test('duplicates audio properties', () => {
  const {
    oscillatorMock,
    nodeEditor,
    getMenuItem,
    addAudioNode,
    getGraphNodes,
  } = setup('Nodes')
  addAudioNode('Oscillator')
  const [oscillator1] = getGraphNodes()

  const typeField1 = findFieldByLabel(oscillator1, 'w-select', 'Type')
  typeField1.click()
  getSelectOption(typeField1, 'Sawtooth').click()

  const frequencyFieldInput1 = findFieldInputByLabel(
    oscillator1,
    'w-number-field',
    'Frequency',
  )
  frequencyFieldInput1.valueAsNumber = 880
  frequencyFieldInput1.dispatchEvent(
    new InputEvent('input', { composed: true }),
  )

  oscillatorMock.type = 'sine'
  oscillatorMock.frequency.value = 440

  click(oscillator1)
  contextMenu(oscillator1)
  getMenuItem('Duplicate').click()
  nodeEditor.dispatchEvent(new MouseEvent('mousemove'))
  click(nodeEditor)

  const oscillator2 = getGraphNodes()[1]
  const typeFieldInput2 = findFieldInputByLabel(oscillator2, 'w-select', 'Type')
  const frequencyFieldInput2 = findFieldInputByLabel(
    oscillator2,
    'w-number-field',
    'Frequency',
  )

  expect(typeFieldInput2.value).toBe('sawtooth')
  expect(oscillatorMock.type).toBe('sawtooth')
  expect(frequencyFieldInput2.valueAsNumber).toBe(880)
  expect(oscillatorMock.frequency.value).toBe(880)
})
