import { css, defineCustomElement, html } from '../core/element.js'
import typography from '../core/typography.js'

export default defineCustomElement('w-text-field', {
  styles: css`
    :host {
      position: relative;
      height: 48px;
      flex: 1;
      display: flex;
      border-bottom: 1px solid rgba(var(--color-on-surface) / 0.42);
      border-radius: 4px 4px 0 0;
      background-color: rgba(var(--color-on-surface) / 0.04);
      transition: border-bottom-color 200ms var(--easing-standard);
    }

    label {
      position: absolute;
      top: 20px;
      left: 16px;
      transform: translateY(-100%) scale(0.75);
      transform-origin: bottom left;
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      pointer-events: none;
      transition: color 200ms var(--easing-standard),
        transform 200ms var(--easing-standard);
      ${typography('body1')}
    }

    input {
      flex: 1;
      outline: none;
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: 4px 4px 0 0;
      margin-bottom: -1px;
      padding: 20px 16px 6px 16px;
      background: none;
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
      caret-color: rgb(var(--color-primary));
      transition: background-color 200ms var(--easing-standard),
        border-bottom-color 200ms var(--easing-standard);
      ${typography('body1')}
    }

    :host(:hover) {
      border-bottom-color: rgba(
        var(--color-on-surface) / var(--text-high-emphasis)
      );
    }

    input:hover {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    input:focus {
      border-bottom-color: rgb(var(--color-primary));
      background-color: rgba(var(--color-on-surface) / 0.08);
    }

    input:focus + label {
      color: rgba(var(--color-primary) / var(--text-high-emphasis));
    }

    input:invalid {
      border-bottom-color: rgb(var(--color-error));
    }

    input:invalid + label {
      color: rgb(var(--color-error));
    }

    input:not(:focus):placeholder-shown + label {
      transform: translateY(-6px);
    }
  `,
  template: html`
    <input id="input" placeholder=" " />
    <label for="input"></label>
  `,
  properties: {
    label: String,
    value: String,
    type: String,
    step: String,
    required: Boolean,
  },
  setup({ host, observe }) {
    const label = host.shadowRoot.querySelector('label')
    const input = host.shadowRoot.querySelector('input')

    observe('label', () => {
      label.textContent = host.label
    })

    observe('value', () => {
      input.value = host.value
    })

    observe('type', () => {
      input.type = host.type
    })

    observe('step', () => {
      input.step = host.step
    })

    observe('required', () => {
      input.required = host.required
    })

    input.addEventListener('input', () => {
      host.value = input.value
    })
  },
})
