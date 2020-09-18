import { css, defineCustomElement } from '../core/element.js'
import elevation from '../core/elevation.js'
import typography from '../core/typography.js'

export default defineCustomElement('w-graph-node', {
  styles: css`
    :host {
      position: absolute;
      padding: 16px;
      border-radius: 4px;
      background-color: rgb(var(--color-surface));
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
      transition: box-shadow 150ms var(--easing-standard);
      user-select: none;
      ${elevation(1)}
    }

    :host(:hover),
    :host([selected]) {
      ${elevation(4)}
    }

    :host:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: 4px;
      text-align: right;
      transition: background-color 200ms var(--easing-standard);
    }

    :host(:hover):after {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    :host(:active):after {
      background-color: rgba(var(--color-primary) / 0.16);
    }

    :host([selected]):after {
      background-color: rgba(var(--color-primary) / 0.08);
    }

    slot {
      display: flex;
      align-items: center;
      height: 32px;
      ${typography('headline6')}
    }
  `,
  properties: {
    x: Number,
    y: Number,
    selected: Boolean,
  },
  setup({ host, observe }) {
    observe('x', () => {
      host.style.left = `${host.x}px`
    })

    observe('y', () => {
      host.style.top = `${host.y}px`
    })
  },
})
