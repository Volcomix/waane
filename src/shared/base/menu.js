import { css, defineCustomElement } from '../core/element.js'
import elevation from '../core/elevation.js'

export default defineCustomElement('w-menu', {
  styles: css`
    :host {
      min-width: 112px;
      padding: 8px 0;
      border-radius: 4px;
      background-color: rgb(var(--color-surface));
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
      ${elevation(8)}
    }

    :host(:not([open])) {
      display: none;
    }
  `,
  properties: {
    open: Boolean,
  },
})
