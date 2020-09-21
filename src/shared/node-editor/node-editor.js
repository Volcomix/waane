import { css, defineCustomElement, html } from '../core/element.js'
import useMouseNavigation from '../core/use-mouse-navigation.js'
import useMove from '../core/use-move.js'
import useSelection from '../core/use-selection.js'

export default defineCustomElement('w-node-editor', {
  styles: css`
    :host {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
    }
  `,
  template: html`
    <w-graph>
      <slot></slot>
    </w-graph>
  `,
  properties: {
    panX: Number,
    panY: Number,
  },
  setup({ host }) {
    const graph = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-graph',
    ))

    // The order does matter because each one can stop the immediate
    // propagation to the next one
    useMouseNavigation(host, graph)
    useMove(host, 'w-graph-node')
    useSelection(host, 'w-graph-node')
  },
})
