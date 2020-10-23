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

    :host(:hover:not([disabled])) {
      background-color: var(
        --socket-hover,
        rgba(var(--color-on-surface) / 0.08)
      );
    }

    :host(:active) {
      background-color: rgba(var(--color-on-surface) / 0.16);
    }

    div {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: rgb(var(--socket-color, var(--color-secondary)));
      transition: opacity 300ms var(--easing-standard);
    }

    :host(:not(:active)) div {
      opacity: var(--socket-opacity);
    }

    :host([disabled]) div {
      opacity: var(--text-disabled);
    }
  `,
  template: html`<div></div>`,
  properties: {
    disabled: Boolean,
  },
})
