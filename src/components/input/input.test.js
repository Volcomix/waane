let elementHandle

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  await page.evaluateHandle(`
    import('./components/input/input.js')
  `)
})

beforeEach(async () => {
  elementHandle = await page.evaluateHandle(() => {
    return document.createElement('w-input')
  })
})

it('is named Input by default', async () => {
  const defaultName = await elementHandle.evaluate(element => {
    return element.shadowRoot.querySelector('slot').textContent
  })
  expect(defaultName).toBe('Input')
})
