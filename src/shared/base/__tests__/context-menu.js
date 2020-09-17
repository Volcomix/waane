import { afterEach, expect, test } from '@jest/globals'
import { html } from '../../core/element'
import '../context-menu'

function setup() {
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
    menu: /** @type {import('../menu.js').default} */ (contextMenu.querySelector(
      'w-menu',
    )),
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

test('displays the menu', async () => {
  const { content, menu } = setup()
  expect(menu.open).toBe(false)
  content.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }))
  expect(menu.open).toBe(true)
})

test('hides the menu', async () => {
  const { menu } = setup()
  menu.open = true
  document.body.click()
  expect(menu.open).toBe(false)
})
