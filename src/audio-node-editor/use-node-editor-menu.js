/**
 * @param {HTMLElement} host
 * @param {import('../shared/base/menu.js').default} menu
 */
export default function useNodeEditorMenu(host, menu) {
  host.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    menu.open = true
    menu.x = event.clientX
    menu.y = event.clientY
  })
}
