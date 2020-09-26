import { css, defineCustomElement, html } from '../core/element.js'

export default defineCustomElement('w-graph-node-output', {
  styles: css`
    :host {
      justify-content: flex-end;
    }

    w-graph-node-socket {
      position: absolute;
      right: 0;
      transform: translateX(50%);
    }
  `,
  template: html`
    <slot></slot>
    <w-graph-node-socket></w-graph-node-socket>
  `,
})
