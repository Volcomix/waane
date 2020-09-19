/**
 * @typedef {object} MovableProps
 * @property {number} x
 * @property {number} y
 * @property {boolean} selected
 */

/** @typedef {HTMLElement & MovableProps} MovableElement */

/**
 * @param {HTMLElement} container
 * @param {string} tagName
 */
export default function useMove(container, tagName) {
  /** @type {MovableElement} */
  let movingElement = null

  let isMoving = false

  container.addEventListener('mousedown', (event) => {
    if (event.button !== 0) {
      return
    }
    let element = /** @type {Element} */ (event.target)
    while (!element.matches(tagName)) {
      if (element === container) {
        return
      }
      element = element.parentElement
    }
    movingElement = /** @type {MovableElement} */ (element)
  })

  container.addEventListener('mousemove', (event) => {
    if (!movingElement) {
      return
    }
    isMoving = true
    if (!movingElement.selected) {
      if (!event.ctrlKey) {
        container.querySelectorAll(`${tagName}[selected]`).forEach((
          /** @type {MovableElement} */ element,
        ) => {
          element.selected = false
        })
      }
      movingElement.selected = true
    }
    container.querySelectorAll(`${tagName}[selected]`).forEach((
      /** @type {MovableElement} */ element,
    ) => {
      element.x += event.movementX
      element.y += event.movementY
    })
  })

  container.addEventListener('mouseup', () => {
    movingElement = null
  })

  container.addEventListener(
    'click',
    (event) => {
      if (isMoving) {
        isMoving = false
        event.stopPropagation()
      }
    },
    true,
  )
}
