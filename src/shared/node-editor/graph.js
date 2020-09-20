import { css, defineCustomElement } from '../core/element.js'

export default defineCustomElement('w-graph', {
  styles: css`
    :host {
      display: block;
    }
  `,
})
