import { css, defineCustomElement, html } from '../core/element.js'

export default defineCustomElement('w-graph-node-input', {
  styles: css`
    w-graph-node-socket {
      position: absolute;
      left: 0px;
      transform: translateX(-50%);
    }
  `,
  template: html`
    <slot></slot>
    <w-graph-node-socket></w-graph-node-socket>
  `,
})
