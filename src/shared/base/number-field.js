import { defineCustomElement, html } from '../core/element.js'

/**
 * @typedef {import('./text-field.js').default} TextField
 */

export default defineCustomElement('w-number-field', {
  template: html`<w-text-field type="number" step="any"></w-text-field>`,
  properties: {
    label: String,
    value: Number,
  },
  setup({ host, observe }) {
    const textField = /** @type {TextField} */ (host.shadowRoot.querySelector('w-text-field'))
    textField.value = '0'

    observe('label', () => {
      textField.label = host.label
    })

    observe('value', () => {
      if (Number(textField.value) !== host.value) {
        textField.value = String(host.value)
      }
    })

    textField.addEventListener('input', () => {
      host.value = Number(textField.value)
    })

    textField.addEventListener('blur', () => {
      if (parseFloat(textField.value) === host.value) {
        textField.value = String(host.value)
      }
    })
  },
})
