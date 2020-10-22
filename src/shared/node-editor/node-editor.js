import { css, defineCustomElement, html } from '../core/element.js'
import useGraphLink from './use-graph-link.js'
import useGraphNodeMove from './use-graph-node-move.js'
import useGraphNodeSelection from './use-graph-node-selection.js'
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

    :host([panning]) {
      cursor: all-scroll;
    }

    :host([moving]) {
      cursor: move;
    }

    :host([linking]) {
      --graph-node-hover: none;
    }

    :host([linking='output']) {
      --output-socket-hover: none;
      --output-socket-opacity: 0.38;
    }

    :host([linking='input']) {
      --input-socket-hover: none;
      --input-socket-opacity: 0.38;
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
    panning: Boolean,
    moving: Boolean,
    linking: String, // 'output' or 'input'
  },
  setup({ host, connected, disconnected }) {
    const graph = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-graph',
    ))

    // The order does matter because each one can stop the immediate
    // propagation to the next one
    useGraphLink(host)
    useMouseNavigation(host)
    useGraphNodeMove(host)
    useGraphNodeSelection(host)

    const observer = new MutationObserver(() => {
      graph.style.transform = `scale(${host.zoom}) translate(${host.panX}px, ${host.panY}px)`
    })

    connected(() => {
      observer.observe(host, { attributeFilter: ['zoom', 'pan-x', 'pan-y'] })
    })

    disconnected(() => {
      observer.disconnect()
    })
  },
})
