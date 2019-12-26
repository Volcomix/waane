let moduleHandle

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
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
    const isTemplate = await page.evaluate(
      template => template instanceof HTMLTemplateElement,
      templateHandle,
    )
    expect(isTemplate).toBe(true)
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
      class ShadowElement extends WaaneElement {
        static get template() {
          return html`
            <span>A shadow</span>
          `
        }
      }

      customElements.define('shadow-element', ShadowElement)
      return document.createElement('shadow-element').shadowRoot
    }, moduleHandle)

    await expect(shadowRoot).toMatchElement('span', { text: 'A shadow' })
  })

  it('has no shadow root without template', async () => {
    const hasShadowRoot = await page.evaluate(({ WaaneElement }) => {
      class NoTemplateElement extends WaaneElement {}

      customElements.define('no-template-element', NoTemplateElement)
      return !!document.createElement('no-template-element').shadowRoot
    }, moduleHandle)

    expect(hasShadowRoot).toBe(false)
  })

  it.todo('does not throw without observedAttributes')

  it.todo('memoizes template')

  it.todo('memoizes observedAttributes')

  it.todo('calls the associated _setter when an attribute changes')

  it.todo('reflects from property to attribute')

  it.todo('reflects from attribute to property')
})
