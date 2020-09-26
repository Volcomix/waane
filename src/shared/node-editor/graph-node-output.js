import { css, defineCustomElement } from '../core/element.js'

export default defineCustomElement('w-graph-node-output', {
  styles: css`
    :host {
      justify-content: flex-end;
    }

    :host::after {
      content: '';
      position: absolute;
      right: -4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgb(var(--color-secondary));
    }
  `,
})
