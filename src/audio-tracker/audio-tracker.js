import { css, defineCustomElement, html } from '../shared/core/element.js'
import typography from '../shared/core/typography.js'

export default defineCustomElement('audio-tracker', {
  styles: css`
    span {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(var(--color-on-background) / var(--text-medium-emphasis));
      ${typography('body2')}
    }
  `,
  template: html`<span>Not implemented</span>`,
})
