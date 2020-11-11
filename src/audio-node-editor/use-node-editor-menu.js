/**
 * @typedef {import('../shared/base/menu.js').default} Menu
 */

/**
 * @param {HTMLElement} host
 * @param {Menu} menu
 */
export default function useNodeEditorMenu(host, menu) {
  host.addEventListener('contextmenu', (event) => {
    menu.open = true
    menu.x = event.clientX
    menu.y = event.clientY
  })
}
