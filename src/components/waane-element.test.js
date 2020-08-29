import { expect, it, jest } from '@jest/globals'
import { css, html, WaaneElement } from './waane-element'

let testTagNameId = 0

function defineElement(elementClass) {
  const tagName = `test-${testTagNameId++}`
  customElements.define(tagName, elementClass)
  return tagName
}

it('has no shadow root without styles nor template', () => {
  const tagName = defineElement(class extends WaaneElement {})
  const element = document.createElement(tagName)
  expect(element.shadowRoot).toBeNull()
})

it('initializes the shadow root without styles', () => {
  const template = html`<span>A shadow</span>`
  const tagName = defineElement(
    class extends WaaneElement {
      static get template() {
        return template
      }
    },
  )
  const element = document.createElement(tagName)
  expect(element.shadowRoot.innerHTML).toBe(template)
})

it('initializes the shadow root without template', () => {
  const styles = css`
    :host {
      --a-style: red;
    }
  `
  const tagName = defineElement(
    class extends WaaneElement {
      static get styles() {
        return styles
      }
    },
  )
  const element = document.createElement(tagName)
  expect(element.shadowRoot.innerHTML).toBe(`<style>${styles}</style>`)
})

it('initializes the shadow root without properties', () => {
  const styles = css`
    :host {
      --a-style: red;
    }
  `
  const template = html`<span>A shadow</span>`
  const tagName = defineElement(
    class extends WaaneElement {
      static get styles() {
        return styles
      }

      static get template() {
        return template
      }
    },
  )
  const element = document.createElement(tagName)
  expect(element.shadowRoot.innerHTML).toBe(
    `<style>${styles}</style>${template}`,
  )
})

it('memoizes styles', () => {
  const stylesMock = jest.fn()
  const tagName = defineElement(
    class extends WaaneElement {
      static get styles() {
        stylesMock()
      }
    },
  )
  document.createElement(tagName)
  document.createElement(tagName)
  document.createElement(tagName)
  expect(stylesMock).toHaveBeenCalledTimes(1)
})

it('memoizes template', () => {
  const templateMock = jest.fn()
  const tagName = defineElement(
    class extends WaaneElement {
      static get template() {
        templateMock()
      }
    },
  )
  document.createElement(tagName)
  document.createElement(tagName)
  document.createElement(tagName)
  expect(templateMock).toHaveBeenCalledTimes(1)
})

it('memoizes properties', () => {
  const propertiesMock = jest.fn()
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        propertiesMock()
      }
    },
  )
  document.createElement(tagName)
  document.createElement(tagName)
  document.createElement(tagName)
  document.createElement(tagName)
  document.createElement(tagName)

  // Expected to be called once by the browser and once by WaaneElement
  expect(propertiesMock).toHaveBeenCalledTimes(2)
})

it('calls the associated _setter with a String when an attribute changes', () => {
  const setterMock = jest.fn()
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        return { someData: String }
      }

      set _someData(value) {
        setterMock(value)
      }
    },
  )
  const element = document.createElement(tagName)
  element.setAttribute('some-data', 'aValue')
  expect(setterMock).toHaveBeenCalledWith('aValue')
})

it('calls the associated _setter with true when an attribute changes', () => {
  const setterMock = jest.fn()
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }

      set _someData(value) {
        setterMock(value)
      }
    },
  )
  const element = document.createElement(tagName)
  element.setAttribute('some-data', 'aValue')
  expect(setterMock).toHaveBeenCalledWith(true)
})

it('calls the associated _setter with false when an attribute changes', () => {
  const setterMock = jest.fn()
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }

      set _someData(value) {
        setterMock(value)
      }
    },
  )
  const element = document.createElement(tagName)
  element.someData = true
  element.removeAttribute('some-data')
  expect(setterMock).toHaveBeenLastCalledWith(false)
})

it('reflects from String property to attribute', () => {
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        return { someData: String }
      }
    },
  )
  const element = document.createElement(tagName)
  element.someData = 'aValue'
  expect(element.getAttribute('some-data')).toBe('aValue')
})

it('reflects from attribute to String property', () => {
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        return { someData: String }
      }
    },
  )
  const element = document.createElement(tagName)
  element.setAttribute('some-data', 'aValue')
  expect(element.someData).toBe('aValue')
})

it('reflects true from property to attribute', () => {
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }
    },
  )
  const element = document.createElement(tagName)
  element.someData = true
  expect(element.getAttribute('some-data')).toBe('')
})

it('reflects false from property to attribute', () => {
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }
    },
  )
  const element = document.createElement(tagName)
  element.someData = false
  expect(element.getAttribute('some-data')).toBeNull()
})

it('reflects true from attribute to property', () => {
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }
    },
  )
  const element = document.createElement(tagName)
  element.setAttribute('some-data', '')
  expect(element.someData).toBe(true)
})

it('reflects false from attribute to property', () => {
  const tagName = defineElement(
    class extends WaaneElement {
      static get properties() {
        return { someData: Boolean }
      }
    },
  )
  const element = document.createElement(tagName)
  expect(element.someData).toBe(false)
})
