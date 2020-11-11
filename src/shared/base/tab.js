import { css, defineCustomElement } from '../core/element.js'
import typography from '../core/typography.js'

export default defineCustomElement('w-tab', {
  styles: css`
    :host {
      padding: 0 16px;
      min-width: 90px;
      height: 46px;
      border-bottom: 2px solid transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      text-transform: uppercase;
      cursor: pointer;
      user-select: none;
      transition: background-color 200ms var(--easing-standard), color 300ms linear, border-bottom-color 300ms linear;
      ${typography('button')}
    }

    :host([active]) {
      color: rgb(var(--color-primary));
      border-bottom-color: rgb(var(--color-primary));
    }

    :host(:hover) {
      background-color: rgba(var(--color-primary) / 0.04);
    }

    :host(:active) {
      background-color: rgba(var(--color-primary) / 0.16);
    }
  `,
  properties: {
    active: Boolean,
  },
})
