import { css, defineCustomElement } from '../core/element.js'

export default defineCustomElement('w-icon-button', {
  styles: css`
    :host {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
      transition: background-color 100ms var(--easing-standard);
    }

    :host(:hover) {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    :host(:active) {
      background-color: rgba(var(--color-on-surface) / 0.16);
    }
  `,
})
