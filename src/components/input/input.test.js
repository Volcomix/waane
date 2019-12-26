beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  await page.evaluateHandle(`
    import('./components/input/input.js')
  `)
})

it('is named Input by default', async () => {
  const defaultName = await page.evaluate(() => {
    const input = document.createElement('w-input')
    return input.shadowRoot.querySelector('slot').textContent
  })
  expect(defaultName).toBe('Input')
})
