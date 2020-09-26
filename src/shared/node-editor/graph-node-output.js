import { css, defineCustomElement } from '../core/element.js'

export default defineCustomElement('w-graph-node-output', {
  styles: css`
    :host {
      justify-content: flex-end;
    }
  `,
})
