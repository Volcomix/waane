import { css, defineCustomElement, html } from '../shared/core/element.js'
import typography from '../shared/core/typography.js'

export default defineCustomElement('track-effect', {
  styles: css`
    :host {
      width: 30px;
      display: flex;
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      font-family: 'Roboto Mono', monospace;
      cursor: pointer;
      user-select: none;
      ${typography('body2')}
    }

    :host([beat]) {
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }

    :host(:hover) {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    :host(:focus-within) {
      background-color: rgba(var(--color-primary) / 0.12);
    }

    span {
      flex: 1;
      outline: none;
      text-align: center;
    }
  `,
  template: html`<span tabindex="0">··</span>`,
  properties: {
    value: String,
    beat: Boolean,
  },
  setup({ host, observe }) {
    const span = host.shadowRoot.querySelector('span')

    observe('value', () => {
      span.textContent = host.value
    })
  },
})
