import { css, defineCustomElement, html } from '../shared/core/element.js'
import typography from '../shared/core/typography.js'

const link = document.createElement('link')
link.href =
  'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

export default defineCustomElement('audio-track', {
  styles: css`
    :host {
      position: relative;
      border: 1px solid rgba(var(--color-on-surface) / 0.42);
      border-radius: 4px;
      margin-right: 8px;
      padding: 16px 0 8px;
      display: flex;
      flex-direction: column;
      transition: border-color 200ms var(--easing-standard);
    }

    :host(:hover) {
      border-color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }

    :host::before {
      content: '';
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      border: 2px solid transparent;
      border-radius: 4px;
      pointer-events: none;
      transition: border-color 200ms var(--easing-standard);
    }

    :host(:focus-within)::before {
      border-color: rgb(var(--color-primary));
    }

    label {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 0 4px;
      background-color: rgb(var(--color-surface));
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      transition: color 200ms var(--easing-standard);
      ${typography('caption')}
    }

    :host(:focus-within) label {
      color: rgba(var(--color-primary) / var(--text-high-emphasis));
    }

    ::slotted(:nth-child(4n + 1)) {
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }
  `,
  template: html`<label></label><slot></slot>`,
  properties: {
    label: String,
  },
  setup({ host, observe }) {
    const label = host.shadowRoot.querySelector('label')

    observe('label', () => {
      label.textContent = host.label
    })
  },
})
