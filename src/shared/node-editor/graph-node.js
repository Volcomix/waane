import { css, defineCustomElement, html } from '../core/element.js'
import elevation from '../core/elevation.js'
import typography from '../core/typography.js'

const style = css`
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
`

const template = html`
  <style>
    ${style}
  </style>
  <slot></slot>
`

/**
 * @typedef {object} GraphNodeProps
 * @property {number} x
 * @property {number} y
 */

/** @type {import('../core/element.js').Setup<GraphNodeProps>} */
function graphNode({ host, observe }) {
  observe('x', () => {
    host.style.left = `${host.x}px`
  })

  observe('y', () => {
    host.style.top = `${host.y}px`
  })
}

export default defineCustomElement('w-graph-node', template, graphNode, [
  'x',
  'y',
])
