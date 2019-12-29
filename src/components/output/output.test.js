let elementHandle

beforeAll(async () => {
  await page.goto('http://localhost:8081/test.html')
  await page.evaluate(/* js */ `
    import('./components/output/output.js')
  `)
})

beforeEach(async () => {
  elementHandle = await page.evaluateHandle(() => {
    return document.createElement('w-output')
  })
})

it('is named Output by default', async () => {
  const defaultName = await elementHandle.evaluate(element => {
    return element.shadowRoot.querySelector('slot').textContent
  })
  expect(defaultName).toBe('Output')
})
