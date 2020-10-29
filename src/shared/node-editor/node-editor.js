import { css, defineCustomElement, html } from '../core/element.js'
import useGraphLink from './use-graph-link.js'
import useGraphNodeMove from './use-graph-node-move.js'
import useGraphNodeSelection from './use-graph-node-selection.js'
import useMouseNavigation from './use-mouse-navigation.js'

export default defineCustomElement('w-node-editor', {
  styles: css`
    :host {
      position: relative;
      display: block;
      overflow: hidden;
    }

    :host([panning]) {
      cursor: all-scroll;
    }

    :host([selecting]) {
      --graph-node-pointer-events: none;
      --socket-pointer-events: none;
    }

    :host([moving]) {
      cursor: move;
    }

    :host([linking]) {
      --graph-node-pointer-events: none;
    }

    :host([linking='output']) {
      --output-socket-pointer-events: none;
      --output-socket-opacity: var(--text-disabled);
    }

    :host([linking='input']) {
      --input-socket-pointer-events: none;
      --input-socket-opacity: var(--text-disabled);
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
    selecting: Boolean,
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
