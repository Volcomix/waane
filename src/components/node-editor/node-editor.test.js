let elementHandle, linkUpdateMock

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  await page.addStyleTag({
    content: /* css */ `
      w-node-editor {
        width: 600px;
        height: 600px;
      }

      w-node {
        position: absolute;
        display: block;
        width: 100px;
        min-height: 10px;
      }

      w-output {
        display: block;
        height: 10px;
      }

      w-input {
        display: block;
        height: 10px;
      }
    `,
  })
  await page.evaluate(/* js */ `
    import('./components/node-editor/node-editor.js')
  `)

  linkUpdateMock = jest.fn()
  await page.exposeFunction('linkUpdateMock', linkUpdateMock)

  await page.evaluate(() => {
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
      },
    )
  })
})

beforeEach(async () => {
  elementHandle = await page.evaluateHandle(() => {
    document.body.innerHTML = /* HTML */ `
      <w-node-editor></w-node-editor>
    `
    return document.body.firstElementChild
  })
  linkUpdateMock.mockClear()
})

it('gets the nodes', async () => {
  const nodes = await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <span>Span</span>
      <w-node>Node 1</w-node>
      <w-link>Link</w-link>
      <w-node>Node 2</w-node>
    `
    return [...element.nodes].map(node => node.textContent)
  })
  expect(nodes).toEqual(['Node 1', 'Node 2'])
})

it('gets the links', async () => {
  const links = await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <span>Span</span>
      <w-link>Link 1</w-link>
      <w-node>Node</w-node>
      <w-link>Link 2</w-link>
    `
    return [...element.links].map(link => link.textContent)
  })
  expect(links).toEqual(['Link 1', 'Link 2'])
})

it('draws all the links when connected', async () => {
  await page.evaluate(() => {
    document.body.innerHTML = /* HTML */ `
      <w-node-editor>
        <w-node style="left: 100px; top: 100px;">
          <w-output id="out1"></w-output>
        </w-node>
        <w-node style="left: 300px; top: 200px;">
          <w-output id="out2"></w-output>
          <w-input id="in2"></w-input>
        </w-node>
        <w-node style="left: 500px; top: 300px;">
          <w-input id="in3"></w-input>
        </w-node>
        <w-node style="left: 700px; top: 400px;">
          <w-output id="out4"></w-output>
        </w-node>

        <w-link from="out1" to="in2"></w-link>
        <w-link from="out2" to="in3"></w-link>
        <w-link from="out3" to="in4"></w-link>
      </w-node-editor>
    `
  })
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
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-output id="out4"></w-output>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    `
  })
  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 300, y: 215 },
    ],
    [
      { x: 400, y: 205 },
      { x: 500, y: 305 },
    ],
    [null, null],
  ])
})

it('updates links when nodes are added', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 500px; top: 300px;">
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const node1 = document.createElement('w-node')
    node1.style = `left: 100px; top: 100px;`
    node1.innerHTML = /* HTML */ `
      <w-output id="out1"></w-output>
    `
    const node2 = document.createElement('w-node')
    node2.style = `left: 300px; top: 200px;`
    node2.innerHTML = /* HTML */ `
      <w-output id="out2"></w-output>
      <w-input id="in2"></w-input>
    `
    element.appendChild(node1)
    element.appendChild(node2)
  })
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
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const somethingElse = document.createElement('something-else')
    somethingElse.innerHTML = /* HTML */ `
      <w-input id="in2"></w-input>
    `
    element.appendChild(somethingElse)
  })
  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates links when nodes are removed', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.$$eval('w-node', ([node1, node2]) => {
    node1.remove()
    node2.remove()
  })
  expect(linkUpdateMock.mock.calls).toEqual([
    [null, null],
    [null, { x: 500, y: 315 }],
  ])
})

it('does not update links when the removed child is not a node', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <something-else>
        <w-input id="in2"></w-input>
      </something-else>

      <w-link from="out1" to="in2"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.$eval('something-else', somethingElse => {
    somethingElse.remove()
  })
  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates links when nodes move', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.$$eval('w-node', ([node1, node2]) => {
    node1.setAttribute('x', 100)
    node2.setAttribute('x', 300)
  })
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
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <something-else>
        <w-input id="in2"></w-input>
      </something-else>

      <w-link from="out1" to="in2"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.$eval('something-else', somethingElse => {
    somethingElse.setAttribute('x', 100)
  })
  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates links when a node is resized', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
      <w-link from="out3" to="in4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.$eval('w-node:nth-of-type(2)', node2 => {
    node2.dispatchEvent(new Event('w-node-resize', { bubbles: true }))
  })
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
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in3"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.$eval('w-node:nth-of-type(2)', node2 => {
    node2.querySelector('w-output#out2').remove()
    node2.dispatchEvent(new Event('w-node-resize', { bubbles: true }))
  })
  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 300, y: 205 },
    ],
    [null, { x: 500, y: 305 }],
  ])
})

it('erases links when an input is removed', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in3"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
      <w-link from="out2" to="in3"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.$eval('w-node:nth-of-type(2)', node2 => {
    node2.querySelector('w-input#in2').remove()
    node2.dispatchEvent(new Event('w-node-resize', { bubbles: true }))
  })
  expect(linkUpdateMock.mock.calls).toEqual([
    [{ x: 200, y: 105 }, null],
    [
      { x: 400, y: 205 },
      { x: 500, y: 305 },
    ],
  ])
})

it('draws the links when they are added', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-output id="out3"></w-output>
        <w-input id="in3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in4"></w-input>
      </w-node>

      <w-link from="out3" to="in4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const link1 = document.createElement('w-link')
    link1.setAttribute('from', 'out1')
    link1.setAttribute('to', 'in2')

    const link2 = document.createElement('w-link')
    link2.setAttribute('from', 'out2')
    link2.setAttribute('to', 'in3')

    element.appendChild(link1)
    element.appendChild(link2)
  })
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
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node>
        <w-output id="out1"></w-output>
      </w-node>
      <w-node>
        <w-input id="in2"></w-output>
      </w-node>
    `
  })
  await elementHandle.evaluate(element => {
    const somethingElse = document.createElement('something-else')
    somethingElse.setAttribute('from', 'out1')
    somethingElse.setAttribute('to', 'in2')
    element.appendChild(somethingElse)
  })
  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates the link when it starts from another output', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in3"></w-input>
      </w-node>

      <w-link from="out1" to="in3"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.$eval('w-link', link => {
    link.setAttribute('from', 'out2')
  })
  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 400, y: 205 },
      { x: 500, y: 305 },
    ],
  ])
})

it('updates the link when it ends to another input', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out2"></w-output>
        <w-input id="in2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in3"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.$eval('w-link', link => {
    link.setAttribute('to', 'in3')
  })
  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 500, y: 305 },
    ],
  ])
})

it('does not draw links that do not start from an output', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <something-else id="out1"></something-else>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-input id="in2"></w-input>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
    `
  })
  expect(linkUpdateMock.mock.calls).toEqual([[null, { x: 300, y: 205 }]])
})

it('does not draw links that do not end to an input', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <something-else id="in2"></something-else>
      </w-node>

      <w-link from="out1" to="in2"></w-link>
    `
  })
  expect(linkUpdateMock.mock.calls).toEqual([[{ x: 200, y: 105 }, null]])
})

it('deselects all nodes', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node id="node1" selected></w-node>
      <w-node id="node2" selected></w-node>
    `
  })
  await page.mouse.click(500, 500)
  const selectedNodeIds = await elementHandle.$$eval('[selected]', nodes =>
    nodes.map(node => node.id),
  )
  expect(selectedNodeIds).toHaveLength(0)
})

it('deselects all nodes but the new selected one', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node id="node1" selected></w-node>
      <w-node id="node2"></w-node>
    `
  })
  await page.click('#node2')
  const selectedNodeIds = await elementHandle.$$eval('[selected]', nodes =>
    nodes.map(node => node.id),
  )
  expect(selectedNodeIds).toEqual(['node2'])
})

it('zooms in', async () => {
  const transform = await elementHandle.evaluate(element => {
    element.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 }))
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(1.1)')
})

it('stops zooming in', async () => {
  const transform = await elementHandle.evaluate(element => {
    for (let i = 0; i < 30; i++) {
      element.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 }))
    }
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(4.17725)')
})

it('zooms out', async () => {
  const transform = await elementHandle.evaluate(element => {
    element.dispatchEvent(new WheelEvent('wheel', { deltaY: 1 }))
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(0.909091)')
})

it('stops zooming out', async () => {
  const transform = await elementHandle.evaluate(element => {
    for (let i = 0; i < 30; i++) {
      element.dispatchEvent(new WheelEvent('wheel', { deltaY: 1 }))
    }
    return element.shadowRoot.querySelector('.container').style.transform
  })
  expect(transform).toBe('scale(0.122846)')
})

it('draws the links when zoomed in', async () => {
  await elementHandle.evaluate(element => {
    element.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 }))
    element.innerHTML = /* HTML */ `
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

it('draws the links when zoomed out', async () => {
  await elementHandle.evaluate(element => {
    element.dispatchEvent(new WheelEvent('wheel', { deltaY: 1 }))
    element.innerHTML = /* HTML */ `
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
