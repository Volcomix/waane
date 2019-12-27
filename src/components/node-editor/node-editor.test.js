let elementHandle

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  await page.evaluate(`import('./components/node-editor/node-editor.js')`)
})

beforeEach(async () => {
  elementHandle = await page.evaluateHandle(() => {
    return document.createElement('w-node-editor')
  })
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
