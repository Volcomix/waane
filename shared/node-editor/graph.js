import { css, defineCustomElement } from '../core/element.js'

export default defineCustomElement('w-graph', {
  styles: css`
    :host {
      position: absolute;
      top: 50%;
      left: 50%;
      transform-origin: top left;
    }
  `,
})
