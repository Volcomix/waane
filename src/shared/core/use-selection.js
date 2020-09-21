import { doOverlap } from '../helpers/geometry.js'
import { css, defineCustomElement } from './element.js'

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
 * @typedef {object} SelectableProps
 * @property {boolean} selecting
 * @property {boolean} selected
 */

/** @typedef {HTMLElement & SelectableProps} SelectableElement */

/**
 * @param {HTMLElement} host
 * @param {string} tagName
 */
export default function useSelection(host, tagName) {
  let isRectangleSelection = false
  const selectionRectangle = /** @type {SelectionRectangle} */ (document.createElement(
    'w-selection-rectangle',
  ))

  function unselectAll() {
    host.querySelectorAll(`${tagName}[selected]`).forEach((
      /** @type {SelectableElement} */ element,
    ) => {
      element.selected = false
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
      if (element.matches(tagName)) {
        const clickedElement = /** @type {SelectableElement} */ (element)
        clickedElement.selected = !clickedElement.selected
        break
      }
      element = element.parentElement
    }
  })

  host.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || event.altKey) {
      return
    }
    let element = /** @type {Element} */ (event.target)
    while (element !== host) {
      if (element.matches(tagName)) {
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
      host.appendChild(selectionRectangle)
      if (!event.ctrlKey && !event.metaKey) {
        unselectAll()
      }
    }
    selectionRectangle.toX = event.pageX
    selectionRectangle.toY = event.pageY

    const selectionBox = getSelectionBox(selectionRectangle)
    host.querySelectorAll(tagName).forEach((
      /** @type {SelectableElement} */ element,
    ) => {
      const { x, y, width, height } = element.getBoundingClientRect()
      const elementBox = { min: { x, y }, max: { x: x + width, y: y + height } }
      element.selecting = doOverlap(selectionBox, elementBox)
    })
  })

  host.addEventListener('mouseup', () => {
    isRectangleSelection = false
    if (!selectionRectangle.isConnected) {
      return
    }
    host.querySelectorAll(`${tagName}[selecting]`).forEach((
      /** @type {SelectableElement} */ element,
    ) => {
      element.selected = !element.selected
      element.selecting = false
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
