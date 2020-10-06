import { css, defineCustomElement, html } from '../core/element.js'
import typography from '../core/typography.js'

export default defineCustomElement('w-number-field', {
  styles: css`
    :host {
      position: relative;
      height: 48px;
      flex: 1;
      display: flex;
    }

    label {
      position: absolute;
      top: 20px;
      left: 16px;
      transform: translateY(-100%) scale(0.75);
      transform-origin: bottom left;
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      ${typography('body1')}
    }

    input {
      flex: 1;
      outline: none;
      border: none;
      border-bottom: 1px solid rgba(var(--color-on-surface) / 0.42);
      border-radius: 4px 4px 0 0;
      padding: 20px 16px 6px 16px;
      background-color: rgba(var(--color-on-surface) / 0.04);
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
      ${typography('body1')}
    }
  `,
  template: html`
    <label for="input"></label>
    <input id="input" type="number" />
  `,
  properties: {
    label: String,
    value: Number,
  },
  setup({ host, observe }) {
    const label = host.shadowRoot.querySelector('label')
    const input = host.shadowRoot.querySelector('input')

    observe('label', () => {
      label.textContent = host.label
    })

    observe('value', () => {
      input.value = String(host.value)
    })

    input.addEventListener('input', () => {
      host.value = input.valueAsNumber
    })

    host.addEventListener('mousedown', (event) => {
      event.stopPropagation()
    })
  },
})
