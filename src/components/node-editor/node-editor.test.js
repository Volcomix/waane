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

it('draws the links for all nodes when connected', async () => {
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
        <w-link from="out-1" to="in-2"></w-link>
        <w-link from="out-2" to="in-3"></w-link>
      </w-node-editor>
    `
  })
  expect(linkUpdateMock).toHaveBeenCalledTimes(2)
  expect(linkUpdateMock).toHaveBeenNthCalledWith(
    1,
    { x: 200, y: 105 },
    { x: 300, y: 215 },
  )
  expect(linkUpdateMock).toHaveBeenNthCalledWith(
    2,
    { x: 400, y: 205 },
    { x: 500, y: 305 },
  )
})
