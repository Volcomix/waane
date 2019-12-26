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
    templateHandle = await evaluateHandle(
      ({ html }) => html`
        <span>A content</span>
      `,
    )
  })

  it('returns a template', async () => {
    const isTemplate = await templateHandle.evaluate(
      template => template instanceof HTMLTemplateElement,
    )
    expect(isTemplate).toBe(true)
  })

  it('stores the correct content inside the template', async () => {
    const content = await templateHandle.evaluateHandle(
      template => template.content,
    )
    await expect(content).toMatchElement('span', { text: 'A content' })
  })
})

describe('WaaneElement', () => {
  it('has no shadow root without template', async () => {
    const hasShadowRoot = await page.evaluate(({ WaaneElement }) => {
      class NoTemplateElement extends WaaneElement {}

      customElements.define('no-template-element', NoTemplateElement)
      return !!document.createElement('no-template-element').shadowRoot
    }, moduleHandle)

    expect(hasShadowRoot).toBe(false)
  })

  it('initializes the shadow root without observedAttributes', async () => {
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

  it('memoizes template', async () => {
    const templateCallCount = await page.evaluate(({ WaaneElement, html }) => {
      let templateCallCount = 0

      class MemoizedTemplateElement extends WaaneElement {
        static get template() {
          templateCallCount++
          return html`
            <span>A memoized template</span>
          `
        }
      }

      customElements.define(
        'memoized-template-element',
        MemoizedTemplateElement,
      )
      document.createElement('memoized-template-element')
      document.createElement('memoized-template-element')

      return templateCallCount
    }, moduleHandle)

    expect(templateCallCount).toBe(1)
  })

  it.todo('memoizes observedAttributes')

  it.todo('calls the associated _setter when an attribute changes')

  it.todo('reflects from property to attribute')

  it.todo('reflects from attribute to property')
})

function evaluateHandle(pageFunction) {
  return page.evaluateHandle(pageFunction, moduleHandle)
}

function evaluate(pageFunction) {
  return page.evaluate(pageFunction, moduleHandle)
}
