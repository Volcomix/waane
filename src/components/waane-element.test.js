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
    templateHandle = await evaluateHandle(({ html }) => {
      return html`
        <span>A content</span>
      `
    })
  })

  it('returns a template', async () => {
    const isTemplate = await templateHandle.evaluate(template => {
      return template instanceof HTMLTemplateElement
    })
    expect(isTemplate).toBe(true)
  })

  it('stores the correct content inside the template', async () => {
    const contentHandle = await templateHandle.getProperty('content')
    await expect(contentHandle).toMatchElement('span', { text: 'A content' })
  })
})

describe('WaaneElement', () => {
  it('has no shadow root without template', async () => {
    const tagName = await defineElement(({ WaaneElement }) => {
      return class extends WaaneElement {}
    })
    const elementHandle = await createElement(tagName)
    const hasShadowRoot = await elementHandle.evaluate(element => {
      return !!element.shadowRoot
    })
    expect(hasShadowRoot).toBe(false)
  })

  it('initializes the shadow root without observedAttributes', async () => {
    const tagName = await defineElement(({ WaaneElement, html }) => {
      return class extends WaaneElement {
        static get template() {
          return html`
            <span>A shadow</span>
          `
        }
      }
    })
    const elementHandle = await createElement(tagName)
    const shadowRootHandle = await elementHandle.getProperty('shadowRoot')
    await expect(shadowRootHandle).toMatchElement('span', { text: 'A shadow' })
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

async function evaluateHandle(pageFunction) {
  return await page.evaluateHandle(pageFunction, moduleHandle)
}

async function evaluate(pageFunction) {
  return await page.evaluate(pageFunction, moduleHandle)
}

async function defineElement(pageFunction) {
  const elementClassHandle = await evaluateHandle(pageFunction)

  return await elementClassHandle.evaluate(elementClass => {
    window.testTagNameId = (window.testTagNameId || 0) + 1
    const tagName = `test-${testTagNameId}`
    customElements.define(tagName, elementClass)
    return tagName
  })
}

async function createElement(tagName) {
  return await page.evaluateHandle(tagName => {
    return document.createElement(tagName)
  }, tagName)
}
