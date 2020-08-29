import { expect, it } from '@jest/globals'
import './input'

it('is named Input by default', () => {
  const element = document.createElement('w-input')
  const defaultName = element.shadowRoot.querySelector('slot').textContent
  expect(defaultName).toBe('Input')
})
