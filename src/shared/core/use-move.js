/**
 * @typedef {object} MovableProps
 * @property {number} x
 * @property {number} y
 * @property {boolean} moving
 */

/** @typedef {HTMLElement & MovableProps & import("./use-selection").SelectableProps} MovableElement */

/**
 * @callback SetMovingElement
 * @param {MovableElement} movingElement
 * @returns {void}
 */

/**
 * @param {HTMLElement} host
 * @param {string} tagName
 * @param {() => number} getZoom
 */
export default function useMove(host, tagName, getZoom = () => 1) {
  let isMoving = false

  /**
   * @returns {MovableElement}
   */
  function getMovingElement() {
    return host.querySelector(`${tagName}[moving]`)
  }

  host.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || event.altKey) {
      return
    }
    let element = /** @type {Element} */ (event.target)
    while (!element.matches(tagName)) {
      if (element === host) {
        return
      }
      element = element.parentElement
    }
    const movingElement = /** @type {MovableElement} */ (element)
    movingElement.moving = true
  })

  host.addEventListener('mousemove', (event) => {
    const movingElement = getMovingElement()
    if (!movingElement) {
      return
    }
    isMoving = true
    if (!movingElement.selected) {
      if (!event.ctrlKey && !event.metaKey) {
        host.querySelectorAll(`${tagName}[selected]`).forEach((
          /** @type {MovableElement} */ element,
        ) => {
          element.selected = false
        })
      }
      movingElement.selected = true
    }
    const zoom = getZoom()
    host.querySelectorAll(`${tagName}[selected]`).forEach((
      /** @type {MovableElement} */ element,
    ) => {
      element.x += event.movementX / zoom
      element.y += event.movementY / zoom
    })
  })

  host.addEventListener('mouseup', () => {
    const movingElement = getMovingElement()
    if (movingElement) {
      movingElement.moving = false
    }
  })

  host.addEventListener('click', (event) => {
    if (isMoving) {
      event.stopImmediatePropagation()
      isMoving = false
    }
  })
}
