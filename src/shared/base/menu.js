import { css, defineCustomElement, html } from '../core/element.js'
import elevation from '../core/elevation.js'

const style = css`
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
`
export default defineCustomElement(
  'w-menu',
  html`
    <style>
      ${style}
    </style>
    <slot></slot>
  `,
  { open: Boolean },
)
