import { css, defineCustomElement } from '../core/element.js'
import elevation from '../core/elevation.js'
import typography from '../core/typography.js'

export default defineCustomElement('w-fab', {
  styles: css`
    :host {
      border-radius: 24px;
      padding: 12px 20px 12px 12px;
      display: flex;
      align-items: center;
      background-color: rgb(var(--color-fab, var(--color-primary)));
      color: rgb(var(--color-on-fab, var(--color-on-primary)));
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      transition: box-shadow 200ms var(--easing-standard);
      ${typography('button')}
      ${elevation(6)}
    }

    :host(:hover) {
      ${elevation(8)}
    }

    :host(:active) {
      ${elevation(12)}
    }

    :host::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: 24px;
      pointer-events: none;
      transition: background-color 200ms var(--easing-standard);
    }

    :host(:hover)::before {
      background-color: rgba(var(--color-on-fab, var(--color-on-primary)) / 0.08);
    }

    :host(:active)::before {
      background-color: rgba(var(--color-on-fab, var(--color-on-primary)) / 0.32);
    }

    ::slotted(w-icon) {
      margin-right: 12px;
    }
  `,
})
