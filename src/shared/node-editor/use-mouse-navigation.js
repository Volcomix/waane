/**
 * @typedef {import('./node-editor.js').default} NodeEditor
 */

export const defaultZoom = 1
export const defaultPanX = 0
export const defaultPanY = 0

/**
 * @param {NodeEditor} host
 */
export default function useMouseNavigation(host) {
  host.zoom = defaultZoom
  host.panX = defaultPanX
  host.panY = defaultPanY

  host.addEventListener('wheel', (event) => {
    event.preventDefault()
    host.zoom += event.deltaY * (event.deltaMode === event.DOM_DELTA_PIXEL ? -0.001 : -0.016)
    host.zoom = Math.min(Math.max(0.125, host.zoom), 4)
  })

  host.addEventListener('mousedown', (event) => {
    if ((event.buttons & 4) === 0 && ((event.buttons & 1) === 0 || !event.altKey)) {
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
