/**
 * @param {HTMLElement} host
 * @param {import('../shared/base/menu.js').default} menu
 */
export default function useNodeEditorMenu(host, menu) {
  /**
   * @param {MouseEvent} event
   */
  function setMenuPosition(event) {
    const { width, height } = menu.getBoundingClientRect()
    menu.x = Math.min(
      event.clientX,
      document.documentElement.clientWidth - width,
    )
    menu.y = Math.min(
      event.clientY,
      document.documentElement.clientHeight - height,
    )
  }

  host.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    menu.open = true
    setMenuPosition(event)
  })
}
