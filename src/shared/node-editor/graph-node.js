import { css, defineCustomElement } from '../core/element.js'
import elevation from '../core/elevation.js'
import icon from '../core/icon.js'
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

    :host([selected]) {
      ${elevation(3)}
    }

    :host(:hover),
    :host([selecting]) {
      ${elevation(4)}
    }

    :host:after {
      ${icon}
      content: 'check_circle';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 8px;
      border-radius: 4px;
      text-align: right;
      color: transparent;
      transition: background-color 200ms var(--easing-standard),
        color 100ms var(--easing-accelerated);
    }

    :host(:hover):after {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    :host([selected]):after {
      background-color: rgba(var(--color-primary) / 0.08);
      color: rgb(var(--color-primary));
      transition: background-color 200ms var(--easing-standard),
        color 100ms var(--easing-decelerated);
    }

    :host(:active):after,
    :host([selecting]):after {
      background-color: rgba(var(--color-primary) / 0.16);
    }

    :host([selected][selecting]):after {
      background-color: transparent;
      color: rgba(var(--color-primary) / 0.24);
    }

    slot {
      display: flex;
      align-items: center;
      height: 32px;
      margin-right: 24px;
      ${typography('headline6')}
    }
  `,
  properties: {
    x: Number,
    y: Number,
    selecting: Boolean,
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
