let moduleHandle

beforeAll(async () => {
  await page.goto('http://localhost:8080')
  moduleHandle = await page.evaluateHandle(`
    import('./components/waane-element.js')
  `)
})

describe('html', () => {
  let templateHandle

  beforeEach(async () => {
    templateHandle = await page.evaluateHandle(
      ({ html }) => html`
        <span>A content</span>
      `,
      moduleHandle,
    )
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
    await expect(content).toMatchElement('span', { text: 'A content' })
  })
})

describe('WaaneElement', () => {
  it('initializes the shadow root', async () => {
    const shadowRoot = await page.evaluateHandle(({ WaaneElement, html }) => {
      class AnElement extends WaaneElement {
        static get template() {
          return html`
            <span>A shadow</span>
          `
        }
      }

      customElements.define('an-element', AnElement)
      return document.createElement('an-element').shadowRoot
    }, moduleHandle)

    await expect(shadowRoot).toMatchElement('span', { text: 'A shadow' })
  })

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
