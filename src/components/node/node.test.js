let elementHandle, onResizeMock, onBodyClickMock

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  await page.evaluate(/* js */ `
    import('./components/node/node.js')
  `)
  onResizeMock = jest.fn()
  onBodyClickMock = jest.fn()
  await page.exposeFunction('onResizeMock', onResizeMock)
  await page.exposeFunction('onBodyClickMock', onBodyClickMock)
  await page.evaluate(() => {
    document.body.addEventListener('click', event => {
      onBodyClickMock(event.target.nodeName.toLowerCase())
    })
  })
})

beforeEach(async () => {
  elementHandle = await page.evaluateHandle(() => {
    document.body.innerHTML = /* HTML */ `
      <w-node></w-node>
    `
    const element = document.body.firstElementChild
    element.addEventListener('w-node-resize', onResizeMock)
    return element
  })
  onResizeMock.mockClear()
  onBodyClickMock.mockClear()
})

it('is named Node by default', async () => {
  const defaultName = await elementHandle.evaluate(element => {
    return element.shadowRoot.querySelector('slot[name=title]').textContent
  })
  expect(defaultName).toBe('Node')
})

it('gets the outputs', async () => {
  const outputs = await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
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
    element.innerHTML = /* HTML */ `
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
    element.x = 10
    return element.style.left
  })
  expect(left).toBe('10px')
})

it('updates the y position', async () => {
  const top = await elementHandle.evaluate(element => {
    element.y = 10
    return element.style.top
  })
  expect(top).toBe('10px')
})

it('removes the x position', async () => {
  const left = await elementHandle.evaluate(element => {
    element.x = 10
    element.removeAttribute('x')
    return element.style.left
  })
  expect(left).toBe('')
})

it('removes the y position', async () => {
  const top = await elementHandle.evaluate(element => {
    element.y = 10
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
    element.innerHTML = /* HTML */ `
      <span>A child element</span>
    `
  })
  await elementHandle.evaluate(element => {
    element.firstElementChild.id = 'a-child-element-id'
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
    element.x = 10
  })
  expect(onResizeMock).not.toHaveBeenCalled()
})

it('becomes the only selected node', async () => {
  await elementHandle.click()
  const isSelected = await elementHandle.evaluate(element => element.selected)
  expect(isSelected).toBe(true)
  expect(onBodyClickMock.mock.calls).toEqual([['w-node']])
})

it('becomes the only selected node when clicking a child', async () => {
  await elementHandle.evaluate(element => {
    element.innerHTML = /* HTML */ `
      <div id="child">A child</div>
    `
  })
  await page.click('#child')
  const isSelected = await elementHandle.evaluate(element => element.selected)
  expect(isSelected).toBe(true)
  expect(onBodyClickMock.mock.calls).toEqual([['w-node']])
})

it('becomes selected', async () => {
  if (process.platform === 'darwin') {
    await page.keyboard.down('Meta')
  } else {
    await page.keyboard.down('Control')
  }
  await elementHandle.click()
  if (process.platform === 'darwin') {
    await page.keyboard.up('Meta')
  } else {
    await page.keyboard.up('Control')
  }
  const isSelected = await elementHandle.evaluate(element => element.selected)
  expect(isSelected).toBe(true)
  expect(onBodyClickMock).not.toHaveBeenCalled()
})

it('becomes unselected', async () => {
  await elementHandle.evaluate(element => (element.selected = true))
  if (process.platform === 'darwin') {
    await page.keyboard.down('Meta')
  } else {
    await page.keyboard.down('Control')
  }
  await elementHandle.click()
  if (process.platform === 'darwin') {
    await page.keyboard.up('Meta')
  } else {
    await page.keyboard.up('Control')
  }
  const isSelected = await elementHandle.evaluate(element => element.selected)
  expect(isSelected).toBe(false)
  expect(onBodyClickMock).not.toHaveBeenCalled()
})
