import { afterEach, beforeAll, expect, it, jest } from '@jest/globals'
import { html } from '../waane-element'
import './node-editor'

function setupContainer(element) {
  jest
    .spyOn(element._container, 'getBoundingClientRect')
    .mockReturnValue({ x: 0, y: 0, width: 600, height: 600 })
}

function setupSocket(element, x, y) {
  jest
    .spyOn(element, 'getBoundingClientRect')
    .mockReturnValue({ x, y, width: 100, height: 10 })
}

let linkUpdateMock

beforeAll(() => {
  linkUpdateMock = jest.fn()

  customElements.define(
    'w-node',
    class extends HTMLElement {
      constructor() {
        super()
        this.addEventListener('click', () => {
          this.selected = true
        })
      }

      get outputs() {
        return this.querySelectorAll('w-output')
      }

      get inputs() {
        return this.querySelectorAll('w-input')
      }

      set selected(selected) {
        if (selected) {
          this.setAttribute('selected', '')
        } else {
          this.removeAttribute('selected')
        }
      }
    },
  )
  customElements.define(
    'w-link',
    class extends HTMLElement {
      get from() {
        return this.getAttribute('from')
      }

      get to() {
        return this.getAttribute('to')
      }

      update(fromPosition, toPosition) {
        linkUpdateMock(fromPosition, toPosition)
      }
    },
  )
  customElements.define(
    'something-else',
    class extends HTMLElement {
      get outputs() {
        return this.querySelectorAll('w-output')
      }

      get inputs() {
        return this.querySelectorAll('w-input')
      }

      get from() {
        return this.getAttribute('from')
      }

      get to() {
        return this.getAttribute('to')
      }

      update(fromPosition, toPosition) {
        linkUpdateMock(fromPosition, toPosition)
      }
    },
  )
})

afterEach(() => {
  linkUpdateMock.mockClear()
})

it('gets the nodes', () => {
  const element = document.createElement('w-node-editor')
  element.innerHTML = html`
    <span>Span</span>
    <w-node>Node 1</w-node>
    <w-link>Link</w-link>
    <w-node>Node 2</w-node>
  `
  expect([...element.nodes]).toEqual([
    expect.objectContaining({ textContent: 'Node 1' }),
    expect.objectContaining({ textContent: 'Node 2' }),
  ])
})

it('gets the links', () => {
  const element = document.createElement('w-node-editor')
  element.innerHTML = html`
    <span>Span</span>
    <w-link>Link 1</w-link>
    <w-node>Node</w-node>
    <w-link>Link 2</w-link>
  `
  expect([...element.links]).toEqual([
    expect.objectContaining({ textContent: 'Link 1' }),
    expect.objectContaining({ textContent: 'Link 2' }),
  ])
})

it('draws all the links when connected', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node>
        <w-output id="out4"></w-output>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#out1'), 100, 100)
  setupSocket(document.body.querySelector('#out2'), 300, 200)
  setupSocket(document.body.querySelector('#in2'), 300, 210)
  setupSocket(document.body.querySelector('#in3'), 500, 300)

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 300, y: 215 },
    ],
    [
      { x: 400, y: 205 },
      { x: 500, y: 305 },
    ],
  ])
})

it('draws all links when node editor innerHTML is set', async () => {
  document.body.innerHTML = html`<w-node-editor></w-node-editor>`
  const element = document.body.querySelector('w-node-editor')

  await new Promise(setTimeout)

  element.innerHTML = html`
    <w-node>
      <w-output id="out1"></w-output>
    </w-node>
    <w-node>
      <w-output id="out2"></w-output>
      <w-input id="in2"></w-input>
    </w-node>
    <w-node>
      <w-input id="in3"></w-input>
    </w-node>
    <w-node>
      <w-output id="out4"></w-output>
    </w-node>

    <w-link from="out1" to="in2"></w-link>
    <w-link from="out2" to="in3"></w-link>
    <w-link from="out3" to="in4"></w-link>
  `
  setupContainer(element)
  setupSocket(element.querySelector('#out1'), 100, 100)
  setupSocket(element.querySelector('#out2'), 300, 200)
  setupSocket(element.querySelector('#in2'), 300, 210)
  setupSocket(element.querySelector('#in3'), 500, 300)

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 300, y: 215 },
    ],
    [
      { x: 400, y: 205 },
      { x: 500, y: 305 },
    ],
    [undefined, undefined],
  ])
})

it('updates links when nodes are added', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node>
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    </w-node-editor>
  `
  const element = document.body.querySelector('w-node-editor')

  setupContainer(element)
  setupSocket(element.querySelector('#out3'), 500, 300)
  setupSocket(element.querySelector('#in3'), 500, 310)
  setupSocket(element.querySelector('#in4'), 700, 400)

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const node1 = document.createElement('w-node')
  node1.innerHTML = html`<w-output id="out1"></w-output> `
  setupSocket(node1.querySelector('#out1'), 100, 100)

  const node2 = document.createElement('w-node')
  node2.innerHTML = html`
    <w-output id="out2"></w-output>
    <w-input id="in2"></w-input>
  `
  setupSocket(node2.querySelector('#out2'), 300, 200)
  setupSocket(node2.querySelector('#in2'), 300, 210)

  element.appendChild(node1)
  element.appendChild(node2)

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 300, y: 215 },
    ],
    [
      { x: 400, y: 205 },
      { x: 500, y: 315 },
    ],
  ])
})

it('does not update links when the added child is not a node', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
    </w-node-editor>
  `
  const element = document.body.querySelector('w-node-editor')

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const somethingElse = document.createElement('something-else')
  somethingElse.innerHTML = html`<w-input id="in2"></w-input> `
  element.appendChild(somethingElse)

  await new Promise(setTimeout)

  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates links when nodes are removed', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node>
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node>
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#out1'), 100, 100)
  setupSocket(document.body.querySelector('#out2'), 300, 200)
  setupSocket(document.body.querySelector('#in2'), 300, 210)
  setupSocket(document.body.querySelector('#out3'), 500, 300)
  setupSocket(document.body.querySelector('#in3'), 500, 310)
  setupSocket(document.body.querySelector('#in4'), 700, 400)

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const [node1, node2] = document.body.querySelectorAll('w-node')
  node1.remove()
  node2.remove()

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [undefined, undefined],
    [undefined, { x: 500, y: 315 }],
  ])
})

it('does not update links when the removed child is not a node', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <something-else>
        <w-input id="in2"></w-input>
      </something-else>

      <w-link from="out1" to="in2"></w-link>
    </w-node-editor>
  `

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  document.body.querySelector('something-else').remove()

  await new Promise(setTimeout)

  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates links when nodes move', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node>
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node>
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#out1'), 100, 100)
  setupSocket(document.body.querySelector('#out2'), 300, 200)
  setupSocket(document.body.querySelector('#in2'), 300, 210)
  setupSocket(document.body.querySelector('#out3'), 500, 300)
  setupSocket(document.body.querySelector('#in3'), 500, 310)
  setupSocket(document.body.querySelector('#in4'), 700, 400)

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const [node1, node2] = document.body.querySelectorAll('w-node')
  node1.setAttribute('x', 100)
  node2.setAttribute('x', 300)

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 300, y: 215 },
    ],
    [
      { x: 400, y: 205 },
      { x: 500, y: 315 },
    ],
  ])
})

it('does not update links when what moves is not a node', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <something-else>
        <w-input id="in2"></w-input>
      </something-else>

      <w-link from="out1" to="in2"></w-link>
    </w-node-editor>
  `

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  document.body.querySelector('something-else').setAttribute('x', 100)

  await new Promise(setTimeout)

  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates links when a node is resized', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node>
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node>
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#out1'), 100, 100)
  setupSocket(document.body.querySelector('#out2'), 300, 200)
  setupSocket(document.body.querySelector('#in2'), 300, 210)
  setupSocket(document.body.querySelector('#out3'), 500, 300)
  setupSocket(document.body.querySelector('#in3'), 500, 310)
  setupSocket(document.body.querySelector('#in4'), 700, 400)

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const node2 = document.body.querySelector('w-node:nth-of-type(2)')
  node2.dispatchEvent(new Event('w-node-resize', { bubbles: true }))

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 300, y: 215 },
    ],
    [
      { x: 400, y: 205 },
      { x: 500, y: 315 },
    ],
  ])
})

it('erases links when an output is removed', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node>
        <w-input id="in3"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#out1'), 100, 100)
  setupSocket(document.body.querySelector('#out2'), 300, 200)
  setupSocket(document.body.querySelector('#in2'), 300, 210)
  setupSocket(document.body.querySelector('#in3'), 500, 300)

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const node2 = document.body.querySelector('w-node:nth-of-type(2)')
  node2.querySelector('w-output#out2').remove()
  setupSocket(node2.querySelector('#in2'), 300, 200)
  node2.dispatchEvent(new Event('w-node-resize', { bubbles: true }))

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 300, y: 205 },
    ],
    [undefined, { x: 500, y: 305 }],
  ])
})

it('erases links when an input is removed', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node>
        <w-input id="in3"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#out1'), 100, 100)
  setupSocket(document.body.querySelector('#out2'), 300, 200)
  setupSocket(document.body.querySelector('#in2'), 300, 210)
  setupSocket(document.body.querySelector('#in3'), 500, 300)

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const node2 = document.querySelector('w-node:nth-of-type(2)')
  node2.querySelector('w-input#in2').remove()
  node2.dispatchEvent(new Event('w-node-resize', { bubbles: true }))

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [{ x: 200, y: 105 }, undefined],
    [
      { x: 400, y: 205 },
      { x: 500, y: 305 },
    ],
  ])
})

it('draws the links when they are added', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node>
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node>
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out3" to="in4"></w-link>
    </w-node-editor>
  `
  const element = document.body.querySelector('w-node-editor')

  setupContainer(element)
  setupSocket(element.querySelector('#out1'), 100, 100)
  setupSocket(element.querySelector('#out2'), 300, 200)
  setupSocket(element.querySelector('#in2'), 300, 210)
  setupSocket(element.querySelector('#out3'), 500, 300)
  setupSocket(element.querySelector('#in3'), 500, 310)
  setupSocket(element.querySelector('#in4'), 700, 400)

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const link1 = document.createElement('w-link')
  link1.setAttribute('from', 'out1')
  link1.setAttribute('to', 'in2')

  const link2 = document.createElement('w-link')
  link2.setAttribute('from', 'out2')
  link2.setAttribute('to', 'in3')

  element.appendChild(link1)
  element.appendChild(link2)

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 300, y: 215 },
    ],
    [
      { x: 400, y: 205 },
      { x: 500, y: 315 },
    ],
  ])
})

it('does not draw links when the added child is not a link', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-input id="in2"></w-input>
      </w-node>
    </w-node-editor>
  `
  const element = document.body.querySelector('w-node-editor')
  jest.spyOn(element, 'links', 'get').mockImplementation(function () {
    return this.querySelectorAll('something-else')
  })

  await new Promise(setTimeout)

  const somethingElse = document.createElement('something-else')
  somethingElse.setAttribute('from', 'out1')
  somethingElse.setAttribute('to', 'in2')
  element.appendChild(somethingElse)

  await new Promise(setTimeout)

  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates the link when it starts from another output', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node>
        <w-input id="in3"></w-input>
      </w-node>

      <w-link from="out1" to="in3"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#out1'), 100, 100)
  setupSocket(document.body.querySelector('#out2'), 300, 200)
  setupSocket(document.body.querySelector('#in2'), 300, 210)
  setupSocket(document.body.querySelector('#in3'), 500, 300)

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const link = document.body.querySelector('w-link')
  link.setAttribute('from', 'out2')

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 400, y: 205 },
      { x: 500, y: 305 },
    ],
  ])
})

it('updates the link when it ends to another input', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node>
        <w-input id="in3"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#out1'), 100, 100)
  setupSocket(document.body.querySelector('#out2'), 300, 200)
  setupSocket(document.body.querySelector('#in2'), 300, 210)
  setupSocket(document.body.querySelector('#in3'), 500, 300)

  await new Promise(setTimeout)
  linkUpdateMock.mockClear()

  const link = document.body.querySelector('w-link')
  link.setAttribute('to', 'in3')

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 500, y: 305 },
    ],
  ])
})

it('does not draw links that do not start from an output', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <something-else id="out1"></something-else>
      </w-node>
      <w-node>
        <w-input id="in2"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#in2'), 300, 200)

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([[undefined, { x: 300, y: 205 }]])
})

it('does not draw links that do not end to an input', async () => {
  document.body.innerHTML = html`
    <w-node-editor>
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <something-else id="in2"></something-else>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
    </w-node-editor>
  `
  setupContainer(document.body.querySelector('w-node-editor'))
  setupSocket(document.body.querySelector('#out1'), 100, 100)

  await new Promise(setTimeout)

  expect(linkUpdateMock.mock.calls).toEqual([[{ x: 200, y: 105 }, undefined]])
})

it.skip('deselects all nodes', async () => {
  await elementHandle.evaluate((element) => {
    element.innerHTML = html`
      <w-node id="node1" selected></w-node>
      <w-node id="node2" selected></w-node>
    `
  })
  await page.mouse.click(500, 500)
  const selectedNodeIds = await elementHandle.$$eval('[selected]', (nodes) =>
    nodes.map((node) => node.id),
  )
  expect(selectedNodeIds).toHaveLength(0)
})

it.skip('deselects all nodes but the new selected one', async () => {
  await elementHandle.evaluate((element) => {
    element.innerHTML = html`
      <w-node id="node1" selected></w-node>
      <w-node id="node2"></w-node>
    `
  })
  await page.click('#node2')
  const selectedNodeIds = await elementHandle.$$eval('[selected]', (nodes) =>
    nodes.map((node) => node.id),
  )
  expect(selectedNodeIds).toEqual(['node2'])
})

it.skip('zooms in', async () => {
  const transform = await elementHandle.evaluate((element) => {
    element.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 }))
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(1.1) translate(0px, 0px)')
})

it.skip('stops zooming in', async () => {
  const transform = await elementHandle.evaluate((element) => {
    for (let i = 0; i < 30; i++) {
      element.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 }))
    }
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(4.17725) translate(0px, 0px)')
})

it.skip('zooms out', async () => {
  const transform = await elementHandle.evaluate((element) => {
    element.dispatchEvent(new WheelEvent('wheel', { deltaY: 1 }))
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(0.909091) translate(0px, 0px)')
})

it.skip('stops zooming out', async () => {
  const transform = await elementHandle.evaluate((element) => {
    for (let i = 0; i < 30; i++) {
      element.dispatchEvent(new WheelEvent('wheel', { deltaY: 1 }))
    }
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(0.122846) translate(0px, 0px)')
})

it.skip('pans up', async () => {
  const transform = await elementHandle.evaluate((element) => {
    element.dispatchEvent(
      new MouseEvent('mousemove', { buttons: 4, movementY: -10 }),
    )
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(1) translate(0px, -10px)')
})

it.skip('pans right', async () => {
  const transform = await elementHandle.evaluate((element) => {
    element.dispatchEvent(
      new MouseEvent('mousemove', { buttons: 4, movementX: 10 }),
    )
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(1) translate(10px, 0px)')
})

it.skip('pans down', async () => {
  const transform = await elementHandle.evaluate((element) => {
    element.dispatchEvent(
      new MouseEvent('mousemove', { buttons: 4, movementY: 10 }),
    )
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(1) translate(0px, 10px)')
})

it.skip('pans left', async () => {
  const transform = await elementHandle.evaluate((element) => {
    element.dispatchEvent(
      new MouseEvent('mousemove', { buttons: 4, movementX: -10 }),
    )
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(1) translate(-10px, 0px)')
})

it.skip('does not pan', async () => {
  const transform = await elementHandle.evaluate((element) => {
    element.dispatchEvent(
      new MouseEvent('mousemove', { buttons: 1, movementX: 10 }),
    )
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('')
})

it.skip('draws the links when zoomed and panned', async () => {
  await elementHandle.evaluate((element) => {
    element.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 }))
    element.dispatchEvent(
      new MouseEvent('mousemove', { buttons: 1, movementX: 10 }),
    )
    element.innerHTML = html`
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-input id="in2"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
    `
  })
  expect(linkUpdateMock).toHaveBeenCalledTimes(1)
  const [fromPosition, toPosition] = linkUpdateMock.mock.calls[0]
  expect(fromPosition.x).toBeCloseTo(200)
  expect(fromPosition.y).toBeCloseTo(105)
  expect(toPosition.x).toBeCloseTo(300)
  expect(toPosition.y).toBeCloseTo(205)
})
