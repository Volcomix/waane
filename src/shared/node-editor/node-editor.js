import { css, defineCustomElement, html } from '../core/element.js'
import useGraphNodeMove from './use-graph-node-move.js'
import useGraphNodeSelection from './use-grapn-node-selection.js'
import useMouseNavigation from './use-mouse-navigation.js'

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
    zoom: Number,
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
    useGraphNodeMove(host)
    useGraphNodeSelection(host)
  },
})
