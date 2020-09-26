import { css, defineCustomElement, html } from '../core/element.js'

export default defineCustomElement('w-graph-node-socket', {
  styles: css`
    :host {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: background-color 200ms var(--easing-standard);
    }

    :host(:hover) {
      background-color: rgba(var(--color-on-surface) / 0.08);
    }

    div {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: rgb(var(--color-secondary));
    }
  `,
  template: html`<div></div>`,
})
