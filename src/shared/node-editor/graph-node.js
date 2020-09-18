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
      ${elevation(1)}
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

    host.addEventListener('click', () => {
      host.selected = true
    })
  },
})
