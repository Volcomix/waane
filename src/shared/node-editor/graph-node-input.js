import { css, defineCustomElement } from '../core/element.js'

export default defineCustomElement('w-graph-node-input', {
  styles: css`
    :host::before {
      content: '';
      position: absolute;
      left: -4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgb(var(--color-secondary));
    }
  `,
})
