import { css, defineCustomElement } from '../core/element.js'
import { doOverlap } from '../helpers/geometry.js'

/** @typedef {import('./graph-node.js').default} GraphNode */

const SelectionRectangle = defineCustomElement('w-selection-rectangle', {
  styles: css`
    :host {
      position: absolute;
      z-index: 8;
      border: 1px solid rgba(var(--color-primary) / var(--text-medium-emphasis));
      background-color: rgba(var(--color-primary) / 0.08);
      pointer-events: none; /* Required to keep click event firing */
    }
  `,
  properties: {
    fromX: Number,
    fromY: Number,
    toX: Number,
    toY: Number,
  },
  setup({ host, observe }) {
    observe('toX', () => {
      const selectionBox = getSelectionBox(host)
      host.style.left = `${selectionBox.min.x}px`
      host.style.width = `${selectionBox.max.x - selectionBox.min.x}px`
    })

    observe('toY', () => {
      const selectionBox = getSelectionBox(host)
      host.style.top = `${selectionBox.min.y}px`
      host.style.height = `${selectionBox.max.y - selectionBox.min.y}px`
    })
  },
})

/**
 * @param {HTMLElement} host
 */
export default function useGraphNodeSelection(host) {
  let isRectangleSelection = false
  const selectionRectangle = /** @type {SelectionRectangle} */ (document.createElement(
    'w-selection-rectangle',
  ))

  function unselectAll() {
    host.querySelectorAll(`w-graph-node[selected]`).forEach((
      /** @type {GraphNode} */ selectedGraphNode,
    ) => {
      selectedGraphNode.selected = false
    })
  }

  host.addEventListener('click', (event) => {
    if (selectionRectangle.isConnected) {
      selectionRectangle.remove()
      return
    }
    if (!event.ctrlKey && !event.metaKey) {
      unselectAll()
    }
    let element = /** @type {Element} */ (event.target)
    while (element !== host) {
      if (element.matches('w-graph-node')) {
        const graphNode = /** @type {GraphNode} */ (element)
        graphNode.selected = !graphNode.selected
        break
      }
      element = element.parentElement
    }
  })

  host.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || event.altKey) {
      return
    }
    if (host.querySelector('w-graph-node[moving]')) {
      return
    }
    let element = /** @type {Element} */ (event.target)
    while (element !== host) {
      if (element.matches('w-graph-node')) {
        return
      }
      element = element.parentElement
    }
    isRectangleSelection = true
    selectionRectangle.fromX = event.pageX
    selectionRectangle.fromY = event.pageY
  })

  host.addEventListener('mousemove', (event) => {
    if (!isRectangleSelection) {
      return
    }
    if (!selectionRectangle.isConnected) {
      const root = host.shadowRoot || host
      root.appendChild(selectionRectangle)
      if (!event.ctrlKey && !event.metaKey) {
        unselectAll()
      }
    }
    selectionRectangle.toX = event.pageX
    selectionRectangle.toY = event.pageY

    const selectionBox = getSelectionBox(selectionRectangle)
    host.querySelectorAll('w-graph-node').forEach((
      /** @type {GraphNode} */ graphNode,
    ) => {
      const { x, y, width, height } = graphNode.getBoundingClientRect()
      const graphNodeBox = {
        min: { x, y },
        max: { x: x + width, y: y + height },
      }
      graphNode.selecting = doOverlap(selectionBox, graphNodeBox)
    })
  })

  host.addEventListener('mouseup', () => {
    isRectangleSelection = false
    if (!selectionRectangle.isConnected) {
      return
    }
    host.querySelectorAll(`w-graph-node[selecting]`).forEach((
      /** @type {GraphNode} */ graphNode,
    ) => {
      graphNode.selected = !graphNode.selected
      graphNode.selecting = false
    })
  })
}

/**
 * @param {SelectionRectangle} selectionRectangle
 * @returns {import('../helpers/geometry.js').Box}
 */
function getSelectionBox(selectionRectangle) {
  return {
    min: {
      x: Math.min(selectionRectangle.fromX, selectionRectangle.toX),
      y: Math.min(selectionRectangle.fromY, selectionRectangle.toY),
    },
    max: {
      x: Math.max(selectionRectangle.fromX, selectionRectangle.toX),
      y: Math.max(selectionRectangle.fromY, selectionRectangle.toY),
    },
  }
}
