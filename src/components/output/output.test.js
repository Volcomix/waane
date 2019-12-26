beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  await page.evaluateHandle(`
    import('./components/output/output.js')
  `)
})

it('is named Output by default', async () => {
  const defaultName = await page.evaluate(() => {
    const output = document.createElement('w-output')
    return output.shadowRoot.querySelector('slot').textContent
  })
  expect(defaultName).toBe('Output')
})
