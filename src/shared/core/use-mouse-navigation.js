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
export default function useMouseNavigation(host, transformedElement) {
  let isPanning = false
  host.panX = 0
  host.panY = 0

  host.addEventListener('mousedown', (event) => {
    if (
      (event.buttons & 4) === 0 &&
      ((event.buttons & 1) === 0 || !event.altKey)
    ) {
      return
    }
    isPanning = true
  })

  host.addEventListener('mousemove', (event) => {
    if (!isPanning) {
      return
    }
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
