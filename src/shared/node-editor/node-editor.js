import { css, defineCustomElement, html } from '../core/element.js'
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
    setup(host, graph)
    useMove(host, 'w-graph-node')
    useSelection(host, 'w-graph-node')
  },
})

/**
 * @typedef {object} MouseNavigationProps
 * @property {number} panX
 * @property {number} panY
 */

/** @typedef {HTMLElement & MouseNavigationProps} MouseNavigationHost */

/**
 * @param {MouseNavigationHost} host
 * @param {HTMLElement} transformedElement
 */
function setup(host, transformedElement) {
  let isPanning = false
  host.panX = 0
  host.panY = 0

  host.addEventListener('mousemove', (event) => {
    if (
      (event.buttons & 4) === 0 &&
      ((event.buttons & 1) === 0 || !event.altKey)
    ) {
      return
    }
    isPanning = true
    host.panX += event.movementX
    host.panY += event.movementY
    transformedElement.style.transform = `translate(${host.panX}px, ${host.panY}px)`
  })

  host.addEventListener('click', (event) => {
    if (isPanning) {
      event.stopImmediatePropagation()
      isPanning = false
    }
  })
}
