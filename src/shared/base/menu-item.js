import { css, defineCustomElement } from '../core/element.js'
import typography from '../core/typography.js'

export default defineCustomElement('w-menu-item', {
  styles: css`
    :host {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 16px;
      cursor: pointer;
      user-select: none;
      transition: background-color 100ms var(--easing-standard);
      ${typography('body1')}
    }

    :host(:hover) {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    :host(:active) {
      background-color: rgba(var(--color-on-surface) / 0.16);
    }

    :host([selected]) {
      background-color: rgba(var(--color-primary) / 0.08);
    }

    ::slotted(w-icon) {
      margin-right: 20px;
    }
  `,
  properties: {
    value: String,
    selected: Boolean,
  },
})
