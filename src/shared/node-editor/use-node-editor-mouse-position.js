/**
 * @param {import('./node-editor.js').default} host
 */
export default function useNodeEditorMousePosition(host) {
  /**
   * @param {MouseEvent} event
   */
  function getNodeEditorMousePosition(event) {
    const { width, height } = host.getBoundingClientRect()
    return {
      x: (event.pageX - width / 2) / host.zoom - host.panX,
      y: (event.pageY - height / 2) / host.zoom - host.panY,
    }
  }
  return getNodeEditorMousePosition
}
