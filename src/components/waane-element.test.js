let moduleHandle

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  moduleHandle = await page.evaluateHandle(/* js */ `
    import('./components/waane-element.js')
  `)
})

it('has no shadow root without styles nor template', async () => {
  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {}
  })
  const hasShadowRoot = await page.evaluate(tagName => {
    const element = document.createElement(tagName)
    return !!element.shadowRoot
  }, tagName)
  expect(hasShadowRoot).toBe(false)
})

it('initializes the shadow root without styles', async () => {
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

it('initializes the shadow root without template', async () => {
  const tagName = await defineElement(({ WaaneElement, css }) => {
    return class extends WaaneElement {
      static get styles() {
        return css`
          :host {
            --a-style: red;
          }
        `
      }
    }
  })
  const shadowRootHandle = await page.evaluateHandle(tagName => {
    const element = document.createElement(tagName)
    return element.shadowRoot
  }, tagName)
  await expect(shadowRootHandle).toMatchElement('style', { text: '--a-style' })
})

it('initializes the shadow root without properties', async () => {
  const tagName = await defineElement(({ WaaneElement, html, css }) => {
    return class extends WaaneElement {
      static get styles() {
        return css`
          :host {
            --a-style: red;
          }
        `
      }

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
  await expect(shadowRootHandle).toMatchElement('style', { text: '--a-style' })
  await expect(shadowRootHandle).toMatchElement('span', { text: 'A shadow' })
})

it('memoizes styles', async () => {
  const stylesMock = jest.fn()
  await page.exposeFunction('stylesMock', stylesMock)

  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get styles() {
        stylesMock()
      }
    }
  })
  await page.evaluate(tagName => {
    document.createElement(tagName)
    document.createElement(tagName)
    document.createElement(tagName)
  }, tagName)
  expect(stylesMock).toHaveBeenCalledTimes(1)
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

it('memoizes properties', async () => {
  const propertiesMock = jest.fn()
  await page.exposeFunction('propertiesMock', propertiesMock)

  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        propertiesMock()
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
  expect(propertiesMock).toHaveBeenCalledTimes(2)
})

it('calls the associated _setter with a String when an attribute changes', async () => {
  const stringSetterMock = jest.fn()
  await page.exposeFunction('stringSetterMock', stringSetterMock)

  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        return { someData: String }
      }

      set _someData(value) {
        stringSetterMock(value)
      }
    }
  })
  await page.evaluate(tagName => {
    const element = document.createElement(tagName)
    element.setAttribute('some-data', 'aValue')
  }, tagName)
  expect(stringSetterMock).toHaveBeenCalledWith('aValue')
})

it('calls the associated _setter with true when an attribute changes', async () => {
  const trueSetterMock = jest.fn()
  await page.exposeFunction('trueSetterMock', trueSetterMock)

  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }

      set _someData(value) {
        trueSetterMock(value)
      }
    }
  })
  await page.evaluate(tagName => {
    const element = document.createElement(tagName)
    element.setAttribute('some-data', 'aValue')
  }, tagName)
  expect(trueSetterMock).toHaveBeenCalledWith(true)
})

it('calls the associated _setter with false when an attribute changes', async () => {
  const falseSetterMock = jest.fn()
  await page.exposeFunction('falseSetterMock', falseSetterMock)

  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }

      set _someData(value) {
        falseSetterMock(value)
      }
    }
  })
  await page.evaluate(tagName => {
    const element = document.createElement(tagName)
    element.someData = true
    element.removeAttribute('some-data')
  }, tagName)
  expect(falseSetterMock).toHaveBeenLastCalledWith(false)
})

it('reflects from String property to attribute', async () => {
  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        return { someData: String }
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

it('reflects from attribute to String property', async () => {
  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        return { someData: String }
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

it('reflects true from property to attribute', async () => {
  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }
    }
  })
  const attributeValue = await page.evaluate(tagName => {
    const element = document.createElement(tagName)
    element.someData = true
    return element.getAttribute('some-data')
  }, tagName)
  expect(attributeValue).toBe('')
})

it('reflects false from property to attribute', async () => {
  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }
    }
  })
  const attributeValue = await page.evaluate(tagName => {
    const element = document.createElement(tagName)
    element.someData = false
    return element.getAttribute('some-data')
  }, tagName)
  expect(attributeValue).toBe(null)
})

it('reflects true from attribute to property', async () => {
  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }
    }
  })
  const propertyValue = await page.evaluate(tagName => {
    const element = document.createElement(tagName)
    element.setAttribute('some-data', '')
    return element.someData
  }, tagName)
  expect(propertyValue).toBe(true)
})

it('reflects false from attribute to property', async () => {
  const tagName = await defineElement(({ WaaneElement }) => {
    return class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }
    }
  })
  const propertyValue = await page.evaluate(tagName => {
    const element = document.createElement(tagName)
    return element.someData
  }, tagName)
  expect(propertyValue).toBe(false)
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
