import { html } from './waane-element.js'

describe('html', () => {
  let template

  beforeEach(() => {
    template = html`
      <span>A template content</span>
    `
  })

  it('returns a template', () => {
    expect(template).toBeInstanceOf(HTMLTemplateElement)
  })

  it('stores the correct content inside the template', () => {
    expect(template.content).toMatchSnapshot()
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
