let elementHandle, linkUpdateMock

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  await page.addStyleTag({
    content: /* css */ `
      w-node {
        position: absolute;
        display: block;
        width: 100px;
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
        get outputs() {
          return this.querySelectorAll('w-output')
        }

        get inputs() {
          return this.querySelectorAll('w-input')
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
          <w-output id="out-1"></w-output>
        </w-node>
        <w-node style="left: 300px; top: 200px;">
          <w-output id="out-2"></w-output>
          <w-input id="in-2"></w-input>
        </w-node>
        <w-node style="left: 500px; top: 300px;">
          <w-input id="in-3"></w-input>
        </w-node>
        <w-node style="left: 700px; top: 400px;">
          <w-output id="out-4"></w-output>
        </w-node>

        <w-link from="out-1" to="in-2"></w-link>
        <w-link from="out-2" to="in-3"></w-link>
        <w-link from="out-3" to="in-4"></w-link>
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
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out-2"></w-output>
        <w-input id="in-2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in-3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-output id="out-4"></w-output>
      </w-node>

      <w-link from="out-1" to="in-2"></w-link>
      <w-link from="out-2" to="in-3"></w-link>
      <w-link from="out-3" to="in-4"></w-link>
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
        <w-output id="out-3"></w-output>
        <w-input id="in-3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in-4"></w-input>
      </w-node>

      <w-link from="out-1" to="in-2"></w-link>
      <w-link from="out-2" to="in-3"></w-link>
      <w-link from="out-3" to="in-4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const node1 = document.createElement('w-node')
    node1.style = `left: 100px; top: 100px;`
    node1.innerHTML = /* HTML */ `
      <w-output id="out-1"></w-output>
    `
    const node2 = document.createElement('w-node')
    node2.style = `left: 300px; top: 200px;`
    node2.innerHTML = /* HTML */ `
      <w-output id="out-2"></w-output>
      <w-input id="in-2"></w-input>
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
        <w-output id="out-1"></w-output>
      </w-node>

      <w-link from="out-1" to="in-2"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const somethingElse = document.createElement('something-else')
    somethingElse.innerHTML = /* HTML */ `
      <w-input id="in-2"></w-input>
    `
    element.appendChild(somethingElse)
  })
  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates links when nodes are removed', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out-2"></w-output>
        <w-input id="in-2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-output id="out-3"></w-output>
        <w-input id="in-3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in-4"></w-input>
      </w-node>

      <w-link from="out-1" to="in-2"></w-link>
      <w-link from="out-2" to="in-3"></w-link>
      <w-link from="out-3" to="in-4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const [node1, node2] = element.querySelectorAll('w-node')
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
        <w-output id="out-1"></w-output>
      </w-node>
      <something-else>
        <w-input id="in-2"></w-input>
      </something-else>

      <w-link from="out-1" to="in-2"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const somethingElse = element.querySelector('something-else')
    somethingElse.remove()
  })
  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates links when nodes move', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out-2"></w-output>
        <w-input id="in-2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-output id="out-3"></w-output>
        <w-input id="in-3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in-4"></w-input>
      </w-node>

      <w-link from="out-1" to="in-2"></w-link>
      <w-link from="out-2" to="in-3"></w-link>
      <w-link from="out-3" to="in-4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const [node1, node2] = element.querySelectorAll('w-node')
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
        <w-output id="out-1"></w-output>
      </w-node>
      <something-else>
        <w-input id="in-2"></w-input>
      </something-else>

      <w-link from="out-1" to="in-2"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const somethingElse = element.querySelector('something-else')
    somethingElse.setAttribute('x', 100)
  })
  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates links when a node is resized', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out-2"></w-output>
        <w-input id="in-2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-output id="out-3"></w-output>
        <w-input id="in-3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in-4"></w-input>
      </w-node>

      <w-link from="out-1" to="in-2"></w-link>
      <w-link from="out-2" to="in-3"></w-link>
      <w-link from="out-3" to="in-4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const node2 = element.querySelector('w-node:nth-of-type(2)')
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
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out-2"></w-output>
        <w-input id="in-2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in-3"></w-input>
      </w-node>

      <w-link from="out-1" to="in-2"></w-link>
      <w-link from="out-2" to="in-3"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const node2 = element.querySelector('w-node:nth-of-type(2)')
    node2.querySelector('w-output#out-2').remove()
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
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out-2"></w-output>
        <w-input id="in-2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in-3"></w-input>
      </w-node>

      <w-link from="out-1" to="in-2"></w-link>
      <w-link from="out-2" to="in-3"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const node2 = element.querySelector('w-node:nth-of-type(2)')
    node2.querySelector('w-input#in-2').remove()
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
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out-2"></w-output>
        <w-input id="in-2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-output id="out-3"></w-output>
        <w-input id="in-3"></w-input>
      </w-node>
      <w-node style="left: 700px; top: 400px;">
        <w-input id="in-4"></w-input>
      </w-node>

      <w-link from="out-3" to="in-4"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const link1 = document.createElement('w-link')
    link1.setAttribute('from', 'out-1')
    link1.setAttribute('to', 'in-2')

    const link2 = document.createElement('w-link')
    link2.setAttribute('from', 'out-2')
    link2.setAttribute('to', 'in-3')

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
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node>
        <w-input id="in-2"></w-output>
      </w-node>
    `
  })
  await elementHandle.evaluate(element => {
    const somethingElse = document.createElement('something-else')
    somethingElse.setAttribute('from', 'out-1')
    somethingElse.setAttribute('to', 'in-2')
    element.appendChild(somethingElse)
  })
  expect(linkUpdateMock).not.toHaveBeenCalled()
})

it('updates the link when it starts from another output', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <w-node style="left: 100px; top: 100px;">
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out-2"></w-output>
        <w-input id="in-2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in-3"></w-input>
      </w-node>

      <w-link from="out-1" to="in-3"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const link = element.querySelector('w-link')
    link.setAttribute('from', 'out-2')
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
        <w-output id="out-1"></w-output>
      </w-node>
      <w-node style="left: 300px; top: 200px;">
        <w-output id="out-2"></w-output>
        <w-input id="in-2"></w-input>
      </w-node>
      <w-node style="left: 500px; top: 300px;">
        <w-input id="in-3"></w-input>
      </w-node>

      <w-link from="out-1" to="in-2"></w-link>
    `
  })
  linkUpdateMock.mockClear()
  await elementHandle.evaluate(element => {
    const link = element.querySelector('w-link')
    link.setAttribute('to', 'in-3')
  })
  expect(linkUpdateMock.mock.calls).toEqual([
    [
      { x: 200, y: 105 },
      { x: 500, y: 305 },
    ],
  ])
})

it.todo('does not update links that does not start from an output')

it.todo('does not update links that does not end to an input')

it.todo('all setAttribute should be replaced with setter calls')
