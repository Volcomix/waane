import { doOverlap } from '../helpers/geometry.js'
import { css, defineCustomElement } from './element.js'

const SelectionRectangle = defineCustomElement('w-selection-rectangle', {
  styles: css`
    :host {
      position: absolute;
      z-index: 8;
      border: 1px solid rgba(var(--color-primary) / var(--text-medium-emphasis));
      background-color: rgba(var(--color-primary) / 0.08);
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

/** @typedef {HTMLElement & { selected: boolean }} SelectableElement */

/**
 * @param {HTMLElement} container
 * @param {string} tagName
 */
export default function useSelection(container, tagName) {
  const tagNameUpperCase = tagName.toUpperCase()
  let isRectangularSelection = false
  const selectionRectangle = /** @type {SelectionRectangle} */ (document.createElement(
    'w-selection-rectangle',
  ))

  function unselectAll() {
    container.querySelectorAll(`${tagName}[selected]`).forEach((
      /** @type {SelectableElement} */ element,
    ) => {
      element.selected = false
    })
  }

  container.addEventListener('click', (event) => {
    if (!event.ctrlKey) {
      unselectAll()
    }

    let element = /** @type {Element} */ (event.target)
    while (element !== container) {
      if (element.tagName === tagNameUpperCase) {
        const clickedElement = /** @type {SelectableElement} */ (element)
        clickedElement.selected = event.ctrlKey
          ? !clickedElement.selected
          : true
        break
      }
      element = element.parentElement
    }
  })

  container.addEventListener('mousedown', (event) => {
    if (event.button !== 0) {
      return
    }
    let element = /** @type {Element} */ (event.target)
    while (element !== container) {
      if (element.tagName === tagNameUpperCase) {
        return
      }
      element = element.parentElement
    }
    isRectangularSelection = true
    selectionRectangle.fromX = event.pageX
    selectionRectangle.fromY = event.pageY
  })

  container.addEventListener('mousemove', (event) => {
    if (!isRectangularSelection) {
      return
    }
    if (!selectionRectangle.isConnected) {
      container.appendChild(selectionRectangle)
      unselectAll()
    }
    selectionRectangle.toX = event.pageX
    selectionRectangle.toY = event.pageY

    const selectionBox = getSelectionBox(selectionRectangle)
    container.querySelectorAll(tagName).forEach((
      /** @type {SelectableElement} */ element,
    ) => {
      const { x, y, width, height } = element.getBoundingClientRect()
      const elementBox = { min: { x, y }, max: { x: x + width, y: y + height } }
      element.selected = doOverlap(selectionBox, elementBox)
    })
  })

  container.addEventListener('mouseup', () => {
    selectionRectangle.remove()
    isRectangularSelection = false
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
