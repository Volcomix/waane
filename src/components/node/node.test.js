let elementHandle, onResizeMock

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  await page.evaluateHandle(`
    import('./components/node/node.js')
  `)

  onResizeMock = jest.fn()
  await page.exposeFunction('onResizeMock', onResizeMock)
})

beforeEach(async () => {
  elementHandle = await page.evaluateHandle(() => {
    const newElement = document.createElement('w-node')
    newElement.addEventListener('w-node-resize', onResizeMock)

    const oldElement = document.querySelector('w-node')
    if (oldElement) {
      oldElement.replaceWith(newElement)
    } else {
      document.body.appendChild(newElement)
    }

    return newElement
  })
  onResizeMock.mockClear()
})

it('is named Node by default', async () => {
  const defaultName = await elementHandle.evaluate(element => {
    return element.shadowRoot.querySelector('slot[name=title]').textContent
  })
  expect(defaultName).toBe('Node')
})

it('gets the outputs', async () => {
  const outputs = await elementHandle.evaluate(element => {
    element.innerHTML = String.raw`
      <span slot="title">Node</span>
      <w-output>Output 1</w-output>
      <w-input>Input</w-input>
      <w-output>Output 2</w-output>
    `
    return [...element.outputs].map(output => output.textContent)
  })
  expect(outputs).toEqual(['Output 1', 'Output 2'])
})

it('gets the inputs', async () => {
  const inputs = await elementHandle.evaluate(element => {
    element.innerHTML = String.raw`
      <span slot="title">Node</span>
      <w-input>Input 1</w-input>
      <w-output>Output</w-output>
      <w-input>Input 2</w-input>
    `
    return [...element.inputs].map(input => input.textContent)
  })
  expect(inputs).toEqual(['Input 1', 'Input 2'])
})

it('updates the x position', async () => {
  const left = await elementHandle.evaluate(element => {
    element.setAttribute('x', 10)
    return element.style.left
  })
  expect(left).toBe('10px')
})

it('updates the y position', async () => {
  const top = await elementHandle.evaluate(element => {
    element.setAttribute('y', 10)
    return element.style.top
  })
  expect(top).toBe('10px')
})

it('removes the x position', async () => {
  const left = await elementHandle.evaluate(element => {
    element.setAttribute('x', 10)
    element.removeAttribute('x')
    return element.style.left
  })
  expect(left).toBe('')
})

it('removes the y position', async () => {
  const top = await elementHandle.evaluate(element => {
    element.setAttribute('y', 10)
    element.removeAttribute('y')
    return element.style.top
  })
  expect(top).toBe('')
})

it('dispatches w-node-resize when a child is added', async () => {
  await elementHandle.evaluate(element => {
    element.textContent = 'A text content'
  })
  expect(onResizeMock).toHaveBeenCalledTimes(1)
})

it('dispatches w-node-resize when a child attribute changes', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = String.raw`<span>A child element</span>`
  })
  await elementHandle.evaluate(element => {
    element.firstElementChild.setAttribute('id', 'a-child-element-id')
  })
  expect(onResizeMock).toHaveBeenCalledTimes(2)
})

it('dispatches w-node-resize when character data changes', async () => {
  await elementHandle.evaluate(element => {
    element.textContent = 'A text content'
  })
  await elementHandle.evaluate(element => {
    element.firstChild.data = 'Another text content'
  })
  expect(onResizeMock).toHaveBeenCalledTimes(2)
})

it('does not dispatch w-node-resize when the node moves', async () => {
  await elementHandle.evaluate(element => {
    element.setAttribute('x', 10)
  })
  expect(onResizeMock).not.toHaveBeenCalled()
})
