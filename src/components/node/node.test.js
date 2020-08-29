import { afterEach, expect, it, jest } from '@jest/globals'
import { html } from '../waane-element'
import './node'

beforeAll(() => {
  document.body.onclick = jest.fn()
})

afterEach(() => {
  document.body.onclick.mockClear()
})

afterAll(() => {
  document.body.onclick = null
})

it('is named Node by default', () => {
  const element = document.createElement('w-node')
  const defaultName = element.shadowRoot.querySelector('slot[name=title]')
    .textContent
  expect(defaultName).toBe('Node')
})

it('gets the outputs', () => {
  const element = document.createElement('w-node')
  element.innerHTML = html`
    <span slot="title">Node</span>
    <w-output>Output 1</w-output>
    <w-input>Input</w-input>
    <w-output>Output 2</w-output>
  `
  const outputs = [...element.outputs].map((output) => output.textContent)
  expect(outputs).toEqual(['Output 1', 'Output 2'])
})

it('gets the inputs', () => {
  const element = document.createElement('w-node')
  element.innerHTML = html`
    <span slot="title">Node</span>
    <w-input>Input 1</w-input>
    <w-output>Output</w-output>
    <w-input>Input 2</w-input>
  `
  const inputs = [...element.inputs].map((input) => input.textContent)
  expect(inputs).toEqual(['Input 1', 'Input 2'])
})

it('updates the x position', () => {
  const element = document.createElement('w-node')
  element.x = 10
  expect(element.style.left).toBe('10px')
})

it('updates the y position', () => {
  const element = document.createElement('w-node')
  element.y = 10
  expect(element.style.top).toBe('10px')
})

it('removes the x position', () => {
  const element = document.createElement('w-node')
  element.x = 10
  element.removeAttribute('x')
  expect(element.style.left).toBe('')
})

it('removes the y position', () => {
  const element = document.createElement('w-node')
  element.y = 10
  element.removeAttribute('y')
  expect(element.style.top).toBe('')
})

it('dispatches w-node-resize when a child is added', (done) => {
  document.body.innerHTML = html`<w-node></w-node>`
  const element = document.body.querySelector('w-node')
  element.addEventListener('w-node-resize', () => done())
  element.textContent = 'A text content'
})

it('dispatches w-node-resize when a child attribute changes', (done) => {
  document.body.innerHTML = html`<w-node><span>A child element</span></w-node>`
  const element = document.body.querySelector('w-node')
  element.addEventListener('w-node-resize', () => done())
  element.querySelector('span').id = 'a-child-element-id'
})

it('dispatches w-node-resize when character data changes', (done) => {
  document.body.innerHTML = html`<w-node>A text content</w-node>`
  const element = document.body.querySelector('w-node')
  element.addEventListener('w-node-resize', () => done())
  element.firstChild.data = 'Another text content'
})

it('does not dispatch w-node-resize when the node moves', async () => {
  const onResizeMock = jest.fn()
  document.body.innerHTML = html`<w-node></w-node>`
  const element = document.body.querySelector('w-node')
  element.addEventListener('w-node-resize', onResizeMock)
  element.x = 10
  await Promise.resolve()
  expect(onResizeMock).not.toHaveBeenCalled()
})

it('becomes the only selected node', () => {
  document.body.innerHTML = html`<w-node></w-node>`
  const element = document.body.querySelector('w-node')
  element.click()
  expect(element.selected).toBe(true)
  expect(document.body.onclick).toHaveBeenCalledWith(
    expect.objectContaining({ target: element }),
  )
})

it('becomes the only selected node when clicking a child', () => {
  document.body.innerHTML = html`<w-node><div id="child">A child</div></w-node>`
  const element = document.body.querySelector('w-node')
  document.body.querySelector('#child').click()
  expect(element.selected).toBe(true)
  expect(document.body.onclick).toHaveBeenCalledWith(
    expect.objectContaining({ target: element }),
  )
})

it('becomes selected', () => {
  document.body.innerHTML = html`<w-node></w-node>`
  const element = document.body.querySelector('w-node')
  element.dispatchEvent(
    new MouseEvent('click', { bubbles: true, ctrlKey: true }),
  )
  expect(element.selected).toBe(true)
  expect(document.body.onclick).not.toHaveBeenCalled()
})

it('becomes unselected', () => {
  document.body.innerHTML = html`<w-node selected></w-node>`
  const element = document.body.querySelector('w-node')
  element.dispatchEvent(
    new MouseEvent('click', { bubbles: true, ctrlKey: true }),
  )
  expect(element.selected).toBe(false)
  expect(document.body.onclick).not.toHaveBeenCalled()
})
