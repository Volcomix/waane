let moduleHandle

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  moduleHandle = await page.evaluateHandle(`
    import('./components/waane-element.js')
  `)
})

describe('html', () => {
  it('returns a template', async () => {
    const isTemplate = await page.evaluate(({ html }) => {
      const template = html`
        <span>A template</span>
      `
      return template instanceof HTMLTemplateElement
    }, moduleHandle)
    expect(isTemplate).toBe(true)
  })

  it('stores the correct content inside the template', async () => {
    const contentHandle = await page.evaluateHandle(({ html }) => {
      const template = html`
        <span>A content</span>
      `
      return template.content
    }, moduleHandle)
    await expect(contentHandle).toMatchElement('span', { text: 'A content' })
  })
})

describe('WaaneElement', () => {
  it('has no shadow root without template', async () => {
    const tagName = await defineElement(({ WaaneElement }) => {
      return class extends WaaneElement {}
    })
    const hasShadowRoot = await page.evaluate(tagName => {
      const element = document.createElement(tagName)
      return !!element.shadowRoot
    }, tagName)
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
    const shadowRootHandle = await page.evaluateHandle(tagName => {
      const element = document.createElement(tagName)
      return element.shadowRoot
    }, tagName)
    await expect(shadowRootHandle).toMatchElement('span', { text: 'A shadow' })
  })

  it('memoizes template', async () => {
    const templateMock = jest.fn()
    await page.exposeFunction('templateMock', templateMock)

    const tagName = await defineElement(({ WaaneElement }) => {
      return class extends WaaneElement {
        static get template() {
          templateMock()
        }
      }
    })
    await page.evaluate(tagName => {
      document.createElement(tagName)
      document.createElement(tagName)
      document.createElement(tagName)
    }, tagName)
    expect(templateMock).toHaveBeenCalledTimes(1)
  })

  it('memoizes observedAttributes', async () => {
    const observedAttributesMock = jest.fn()
    await page.exposeFunction('observedAttributesMock', observedAttributesMock)

    const tagName = await defineElement(({ WaaneElement }) => {
      return class extends WaaneElement {
        static get observedAttributes() {
          observedAttributesMock()
        }
      }
    })
    await page.evaluate(tagName => {
      document.createElement(tagName)
      document.createElement(tagName)
      document.createElement(tagName)
      document.createElement(tagName)
      document.createElement(tagName)
    }, tagName)

    // Expected to be called once by the browser and once by WaaneElement
    expect(observedAttributesMock).toHaveBeenCalledTimes(2)
  })

  it('calls the associated _setter when an attribute changes', async () => {
    const setterMock = jest.fn()
    await page.exposeFunction('setterMock', setterMock)

    const tagName = await defineElement(({ WaaneElement }) => {
      return class extends WaaneElement {
        static get observedAttributes() {
          return ['some-data']
        }

        set _someData(value) {
          setterMock(value)
        }
      }
    })
    await page.evaluate(tagName => {
      const element = document.createElement(tagName)
      element.setAttribute('some-data', 'aValue')
    }, tagName)
    expect(setterMock).toHaveBeenCalledWith('aValue')
  })

  it('reflects from property to attribute', async () => {
    const tagName = await defineElement(({ WaaneElement }) => {
      return class extends WaaneElement {
        static get observedAttributes() {
          return ['some-data']
        }
      }
    })
    const attributeValue = await page.evaluate(tagName => {
      const element = document.createElement(tagName)
      element.someData = 'aValue'
      return element.getAttribute('some-data')
    }, tagName)
    expect(attributeValue).toBe('aValue')
  })

  it('reflects from attribute to property', async () => {
    const tagName = await defineElement(({ WaaneElement }) => {
      return class extends WaaneElement {
        static get observedAttributes() {
          return ['some-data']
        }
      }
    })
    const propertyValue = await page.evaluate(tagName => {
      const element = document.createElement(tagName)
      element.setAttribute('some-data', 'aValue')
      return element.someData
    }, tagName)
    expect(propertyValue).toBe('aValue')
  })
})

async function defineElement(pageFunction) {
  const elementClassHandle = await page.evaluateHandle(
    pageFunction,
    moduleHandle,
  )
  return await elementClassHandle.evaluate(elementClass => {
    window.testTagNameId = (window.testTagNameId || 0) + 1
    const tagName = `test-${testTagNameId}`
    customElements.define(tagName, elementClass)
    return tagName
  })
}
