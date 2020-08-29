import { expect, it } from '@jest/globals'
import './output'

it('is named Output by default', () => {
  const element = document.createElement('w-output')
  const defaultName = element.shadowRoot.querySelector('slot').textContent
  expect(defaultName).toBe('Output')
})
