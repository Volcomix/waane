import { css, defineCustomElement, html } from '../core/element.js'
import typography from '../core/typography.js'

export default defineCustomElement('w-tooltip', {
  styles: css`
    :host {
      position: relative;
      display: flex;
      justify-content: center;
    }

    span {
      position: absolute;
      top: 100%;
      height: 24px;
      margin-top: 4px;
      padding: 0 8px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      background-color: rgb(var(--color-on-surface));
      color: rgb(var(--color-surface));
      pointer-events: none;
      opacity: 0;
      transform: scale(0.8);
      transition: opacity 150ms var(--easing-accelerated),
        transform 0 linear 150ms;
      ${typography('caption')}
    }

    :host(:hover) span {
      opacity: 1;
      transform: none;
      transition: opacity 150ms var(--easing-decelerated) 150ms,
        transform 150ms var(--easing-decelerated) 150ms;
    }
  `,
  template: html`
    <slot></slot>
    <span></span>
  `,
  properties: {
    text: String,
  },
  setup({ host, observe }) {
    const span = host.shadowRoot.querySelector('span')

    observe('text', () => {
      span.textContent = host.text
    })
  },
})
