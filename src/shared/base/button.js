import { css, defineCustomElement } from '../core/element.js'
import typography from '../core/typography.js'

export default defineCustomElement('w-button', {
  styles: css`
    :host {
      height: 36px;
      border-radius: 4px;
      padding: 0 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      transition: background-color 100ms var(--easing-standard);
      ${typography('button')}
    }

    :host(:hover) {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    :host(:active) {
      background-color: rgba(var(--color-on-surface) / 0.16);
    }

    ::slotted(w-icon) {
      margin-right: 8px;
      font-size: 18px;
      pointer-events: none;
    }
  `,
})
