import { css, defineCustomElement, html } from '../core/element.js'

export default defineCustomElement('w-number-field', {
  styles: css`
    :host {
      flex: 1;
      display: flex;
    }
  `,
  template: html`
    <w-text-field type="number" step="any" required></w-text-field>
  `,
  properties: {
    label: String,
    value: Number,
  },
  setup({ host, observe }) {
    const textField = /** @type {import('./text-field.js').default} */ (host.shadowRoot.querySelector(
      'w-text-field',
    ))

    observe('label', () => {
      textField.label = host.label
    })

    observe('value', () => {
      textField.value = String(host.value)
    })

    textField.addEventListener('input', () => {
      host.value = Number(textField.value)
    })
  },
})
