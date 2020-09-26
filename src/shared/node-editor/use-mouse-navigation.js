// TODO detect magic mouse
const isMagicMouse = false
const zoomFactor = 1.1
const minZoom = zoomFactor ** -22
const maxZoom = zoomFactor ** 15

/**
 * @param {import('./node-editor.js').default} host
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
    if (isMagicMouse) {
      host.zoom += event.deltaY * -0.01
      host.zoom = Math.min(Math.max(0.125, host.zoom), 4)
    } else {
      // Without magic mouse, deltaMode = WheelEvent.DOM_DELTA_PIXEL (0)
      host.zoom *= event.deltaY > 0 ? 1 / zoomFactor : zoomFactor
      host.zoom = Math.min(Math.max(minZoom, host.zoom), maxZoom)
    }
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
