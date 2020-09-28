// TODO detect magic mouse
const isMagicMouse = true
const zoomFactor = 1.1
const minZoom = zoomFactor ** -22
const maxZoom = zoomFactor ** 15

/**
 * @param {import('./node-editor.js').default} host
 */
export default function useMouseNavigation(host) {
  host.zoom = 1
  host.panX = 0
  host.panY = 0

  host.addEventListener('wheel', (event) => {
    event.preventDefault()
    if (isMagicMouse) {
      host.zoom += event.deltaY * -0.001
      host.zoom = Math.min(Math.max(0.125, host.zoom), 4)
    } else {
      // Without magic mouse, deltaMode = WheelEvent.DOM_DELTA_PIXEL (0)
      host.zoom *= event.deltaY > 0 ? 1 / zoomFactor : zoomFactor
      host.zoom = Math.min(Math.max(minZoom, host.zoom), maxZoom)
    }
  })

  host.addEventListener('mousedown', (event) => {
    if (
      (event.buttons & 4) === 0 &&
      ((event.buttons & 1) === 0 || !event.altKey)
    ) {
      return
    }
    host.panning = true
  })

  host.addEventListener('mousemove', (event) => {
    if (!host.panning) {
      return
    }
    host.panX += event.movementX / host.zoom
    host.panY += event.movementY / host.zoom
  })

  host.addEventListener('click', (event) => {
    if (host.panning) {
      event.stopImmediatePropagation()
      host.panning = false
    }
  })

  host.addEventListener('auxclick', () => {
    host.panning = false
  })
}
