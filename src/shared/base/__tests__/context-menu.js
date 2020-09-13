import { afterEach, expect, test } from '@jest/globals'
import { html } from '../../core/element'
import '../context-menu'

function renderContextMenu() {
  document.body.innerHTML = html`
    <w-context-menu>
      <span>Some content</span>
      <w-menu>
        <w-menu-item>Menu item</w-menu-item>
      </w-menu>
    </w-context-menu>
  `
  const contextMenu = /** @type {HTMLElement} */ (document.body.querySelector(
    'w-context-menu',
  ))
  return {
    contextMenu,
    content: contextMenu.querySelector('span'),
    menu: /** @type {HTMLElement} */ (contextMenu.querySelector('w-menu')),
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

test('displays the menu', async () => {
  const { content, menu } = renderContextMenu()
  expect(menu.hidden).toBe(true)
  content.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }))
  expect(menu.hidden).toBe(false)
})

test('hides the menu', async () => {
  const { menu } = renderContextMenu()
  menu.hidden = false
  document.body.click()
  expect(menu.hidden).toBe(true)
})
