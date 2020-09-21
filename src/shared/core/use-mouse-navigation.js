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
 * @param {number} zoomFactor
 * @param {number} minZoom
 * @param {number} maxZoom
 */
export default function useMouseNavigation(
  host,
  transformedElement,
  zoomFactor = 1.025,
  minZoom = 0.2,
  maxZoom = 3,
) {
  let isPanning = false
  host.zoom = 1
  host.panX = 0
  host.panY = 0

  function transform() {
    transformedElement.style.transform = `scale(${host.zoom}) translate(${host.panX}px, ${host.panY}px)`
  }

  host.addEventListener('wheel', (event) => {
    event.preventDefault()
    if (event.deltaY > 0) {
      host.zoom /= zoomFactor
    } else {
      host.zoom *= zoomFactor
    }
    host.zoom = Math.min(Math.max(host.zoom, minZoom), maxZoom)
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
