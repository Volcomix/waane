/**
 * @typedef {object} MovableProps
 * @property {number} x
 * @property {number} y
 * @property {boolean} selected
 */

/** @typedef {HTMLElement & MovableProps} MovableElement */

/**
 * @callback SetMovingElement
 * @param {MovableElement} movingElement
 * @returns {void}
 */

/**
 * @param {HTMLElement} host
 * @param {string} tagName
 * @returns {SetMovingElement}
 */
export default function useMove(host, tagName) {
  /** @type {MovableElement} */
  let movingElement = null

  let isMoving = false

  host.addEventListener('mousedown', (event) => {
    if (event.button !== 0) {
      return
    }
    let element = /** @type {Element} */ (event.target)
    while (!element.matches(tagName)) {
      if (element === host) {
        return
      }
      element = element.parentElement
    }
    movingElement = /** @type {MovableElement} */ (element)
  })

  host.addEventListener('mousemove', (event) => {
    if (!movingElement) {
      return
    }
    isMoving = true
    if (!movingElement.selected) {
      if (!event.ctrlKey) {
        host.querySelectorAll(`${tagName}[selected]`).forEach((
          /** @type {MovableElement} */ element,
        ) => {
          element.selected = false
        })
      }
      movingElement.selected = true
    }
    host.querySelectorAll(`${tagName}[selected]`).forEach((
      /** @type {MovableElement} */ element,
    ) => {
      element.x += event.movementX
      element.y += event.movementY
    })
  })

  host.addEventListener('mouseup', () => {
    movingElement = null
  })

  host.addEventListener(
    'click',
    (event) => {
      if (isMoving) {
        isMoving = false
        event.stopPropagation()
      }
    },
    true,
  )

  return (element) => {
    movingElement = element
  }
}
