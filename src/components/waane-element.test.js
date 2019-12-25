describe('html', () => {
  let templateHandle

  beforeAll(async () => {
    await page.goto('http://localhost:8080')
    await page.setContent('')
  })

  beforeEach(async () => {
    templateHandle = await page.evaluateHandle(`
      import('./components/waane-element.js')
      .then(({ html }) => html\`<span>A template content</span>\`)
    `)
  })

  afterEach(async () => {
    await templateHandle.dispose()
  })

  it('returns a template', async () => {
    const className = await page.evaluate(
      template => template.constructor.name,
      templateHandle,
    )
    expect(className).toBe('HTMLTemplateElement')
  })

  it('stores the correct content inside the template', async () => {
    const content = await page.evaluateHandle(
      template => template.content,
      templateHandle,
    )
    await expect(content).toMatchElement('span', { text: 'A template content' })
  })
})

describe('WaaneElement', () => {
  it.todo('initializes the shadow root')

  it.todo('registers a _setter for each attribute')

  it.todo('registers a property for each attribute')

  it.todo('does not throw without template')

  it.todo('does not throw without observedAttributes')

  it.todo('memoizes template')

  it.todo('memoizes observedAttributes')

  it.todo('calls the associated _setter when an attribute changes')

  it.todo('reflects from property to attribute')

  it.todo('reflects from attribute to property')
})
