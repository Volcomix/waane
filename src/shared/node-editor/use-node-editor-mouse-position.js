/**
 * @param {import('./node-editor.js').default} host
 */
export default function useNodeEditorMousePosition(host) {
  /**
   * @param {MouseEvent} event
   */
  function getNodeEditorMousePosition(event) {
    const { x, y, width, height } = host.getBoundingClientRect()
    return {
      x: (event.clientX - x - width / 2) / host.zoom - host.panX,
      y: (event.clientY - y - height / 2) / host.zoom - host.panY,
    }
  }
  return getNodeEditorMousePosition
}
