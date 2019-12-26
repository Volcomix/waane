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
    const templateMock = jest.fn()
    await page.exposeFunction('templateMock', templateMock)

    const tagName = await defineElement(({ WaaneElement }) => {
      return class extends WaaneElement {
        static get template() {
          templateMock()
        }
      }
    })
    await createElement(tagName)
    await createElement(tagName)
    await createElement(tagName)
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
    await createElement(tagName)
    await createElement(tagName)
    await createElement(tagName)
    await createElement(tagName)
    await createElement(tagName)

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
    const elementHandle = await createElement(tagName)
    await elementHandle.evaluate(element => {
      element.setAttribute('some-data', 'aValue')
    })
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
    const elementHandle = await createElement(tagName)
    const attributeValue = await elementHandle.evaluate(element => {
      element.someData = 'aValue'
      return element.getAttribute('some-data')
    })
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
    const elementHandle = await createElement(tagName)
    const propertyValue = await elementHandle.evaluate(element => {
      element.setAttribute('some-data', 'aValue')
      return element.someData
    })
    expect(propertyValue).toBe('aValue')
  })
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
