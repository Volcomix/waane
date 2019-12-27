let elementHandle

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  await page.evaluate(`import('./components/link/link.js')`)
})

beforeEach(async () => {
  elementHandle = await page.evaluateHandle(() => {
    return document.createElement('w-link')
  })
})

it('updates the bounding box', async () => {
  const boundingBox = await elementHandle.evaluate(element => {
    element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
    const { left, top, width, height } = element.style
    return { left, top, width, height }
  })
  expect(boundingBox).toEqual({
    left: '10px',
    top: '20px',
    width: '20px',
    height: '20px',
  })
})

it('updates the bounding box when the link goes from right to left', async () => {
  const boundingBox = await elementHandle.evaluate(element => {
    element.update({ x: 30, y: 20 }, { x: 10, y: 40 })
    const { left, top, width, height } = element.style
    return { left, top, width, height }
  })
  expect(boundingBox).toEqual({
    left: '10px',
    top: '20px',
    width: '20px',
    height: '20px',
  })
})

it('updates the bounding box when the link goes from bottom to top', async () => {
  const boundingBox = await elementHandle.evaluate(element => {
    element.update({ x: 10, y: 40 }, { x: 30, y: 20 })
    const { left, top, width, height } = element.style
    return { left, top, width, height }
  })
  expect(boundingBox).toEqual({
    left: '10px',
    top: '20px',
    width: '20px',
    height: '20px',
  })
})

it('removes the bounding box without fromPosition', async () => {
  const boundingBox = await elementHandle.evaluate(element => {
    element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
    element.update(null, { x: 30, y: 40 })
    const { left, top, width, height } = element.style
    return { left, top, width, height }
  })
  expect(boundingBox).toEqual({ left: '', top: '', width: '', height: '' })
})

it('removes the bounding box without toPosition', async () => {
  const boundingBox = await elementHandle.evaluate(element => {
    element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
    element.update({ x: 10, y: 20 }, null)
    const { left, top, width, height } = element.style
    return { left, top, width, height }
  })
  expect(boundingBox).toEqual({ left: '', top: '', width: '', height: '' })
})

it('updates the path', async () => {
  const path = await elementHandle.evaluate(element => {
    element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
    return element.shadowRoot.querySelector('path').getAttribute('d')
  })
  expect(path).toBe('M 0,0 C 10,0 10,20 20,20')
})

it('updates the path when the link goes from right to left', async () => {
  const path = await elementHandle.evaluate(element => {
    element.update({ x: 30, y: 20 }, { x: 10, y: 40 })
    return element.shadowRoot.querySelector('path').getAttribute('d')
  })
  expect(path).toBe('M 20,0 C 30,0 -10,20 0,20')
})

it('updates the path when the link goes from bottom to top', async () => {
  const path = await elementHandle.evaluate(element => {
    element.update({ x: 10, y: 40 }, { x: 30, y: 20 })
    return element.shadowRoot.querySelector('path').getAttribute('d')
  })
  expect(path).toBe('M 0,20 C 10,20 10,0 20,0')
})

it('erases the path without fromPosition', async () => {
  const path = await elementHandle.evaluate(element => {
    element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
    element.update(null, { x: 30, y: 40 })
    return element.shadowRoot.querySelector('path').getAttribute('d')
  })
  expect(path).toBe(null)
})

it('erases the path without toPosition', async () => {
  const path = await elementHandle.evaluate(element => {
    element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
    element.update({ x: 10, y: 20 }, null)
    return element.shadowRoot.querySelector('path').getAttribute('d')
  })
  expect(path).toBe(null)
})
