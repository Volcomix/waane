/**
 * @typedef {object} MouseNavigationProps
 * @property {number} zoom
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
  host.zoom = 1
  host.panX = 0
  host.panY = 0

  function transform() {
    transformedElement.style.transform = `scale(${host.zoom}) translate(${host.panX}px, ${host.panY}px)`
  }

  host.addEventListener('wheel', (event) => {
    event.preventDefault()
    host.zoom += event.deltaY * -0.01
    host.zoom = Math.min(Math.max(0.125, host.zoom), 4)
    transform()
  })

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
    host.panX += event.movementX / host.zoom
    host.panY += event.movementY / host.zoom
    transform()
  })

  host.addEventListener('click', (event) => {
    if (isPanning) {
      event.stopImmediatePropagation()
      isPanning = false
    }
  })
}
