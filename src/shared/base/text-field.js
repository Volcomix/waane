import { css, defineCustomElement, html } from '../core/element.js'
import typography from '../core/typography.js'

const valueStyles = css`
  padding: 20px 16px 6px 16px;
  color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
  ${typography('body1')}
`

export default defineCustomElement('w-text-field', {
  styles: css`
    :host {
      position: relative;
      min-width: 140px;
      height: 48px;
      display: flex;
      border-bottom: 1px solid rgba(var(--color-on-surface) / 0.42);
      border-radius: 4px 4px 0 0;
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    :host(:hover) {
      border-bottom-color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }

    input {
      ${valueStyles}
      flex: 1;
      outline: none;
      border: none;
      background: none;
      caret-color: rgb(var(--color-primary));
      box-shadow: none;
      transition: caret-color 200ms var(--easing-standard);
    }

    input[type='number'] {
      appearance: textfield;
    }

    input[type='number']::-webkit-inner-spin-button {
      appearance: none;
    }

    input:invalid {
      caret-color: rgb(var(--color-error));
    }

    label {
      position: absolute;
      top: 20px;
      left: 16px;
      transform: translateY(-100%) scale(0.75);
      transform-origin: bottom left;
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      pointer-events: none;
      transition: color 200ms var(--easing-standard), transform 200ms var(--easing-standard);
      ${typography('body1')}
    }

    :host(:not(:focus-within)) input:placeholder-shown + label {
      transform: translateY(-6px);
    }

    :host(:focus-within) input:not(:invalid) + label {
      color: rgba(var(--color-primary) / var(--text-high-emphasis));
    }

    input:invalid + label {
      color: rgb(var(--color-error));
    }

    span {
      ${valueStyles}
      position: absolute;
      top: 0;
      right: 0;
      bottom: -1px;
      left: 0;
      outline: none;
      border-bottom: 2px solid transparent;
      border-radius: 4px 4px 0 0;
      transition: background-color 200ms var(--easing-standard), border-bottom-color 200ms var(--easing-standard);
    }

    ::slotted(*) {
      pointer-events: none;
    }

    span:not([tabindex]) {
      pointer-events: none;
    }

    :host(:hover) span {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    :host(:focus-within) span {
      background-color: rgba(var(--color-on-surface) / 0.08);
    }

    :host(:focus-within) input:not(:invalid) + label + span {
      border-bottom-color: rgb(var(--color-primary));
    }

    input:invalid + label + span {
      border-bottom-color: rgb(var(--color-error));
    }

    slot[name='trailing'] {
      position: absolute;
      right: 12px;
      height: 100%;
      display: flex;
      align-items: center;
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      pointer-events: none;
      transition: color 200ms var(--easing-standard);
    }

    :host(:focus-within) input:not(:invalid) + label + span + slot[name='trailing'] {
      color: rgb(var(--color-primary));
    }

    input:invalid + label + span + slot[name='trailing'] {
      color: rgb(var(--color-error));
    }
  `,
  template: html`
    <input id="input" required placeholder=" " />
    <label for="input"></label>
    <span><slot></slot></span>
    <slot name="trailing"></slot>
  `,
  properties: {
    label: String,
    value: String,
    type: String,
    step: String,
  },
  setup({ host, observe }) {
    const label = host.shadowRoot.querySelector('label')
    const input = host.shadowRoot.querySelector('input')
    const span = host.shadowRoot.querySelector('span')

    observe('label', () => {
      label.textContent = host.label
    })

    observe('value', () => {
      input.value = host.value
    })

    observe('type', () => {
      if (host.type === 'select') {
        input.removeAttribute('type')
        input.hidden = true
        span.tabIndex = 0
      } else {
        input.type = host.type
        input.hidden = false
        span.removeAttribute('tabIndex')
      }
    })

    observe('step', () => {
      input.step = host.step
    })

    input.addEventListener('input', () => {
      host.value = input.value
    })
  },
})
