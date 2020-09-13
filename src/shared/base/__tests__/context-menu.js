import { afterEach, expect, test } from '@jest/globals'
import { html } from '../../../helpers/template'
import '../context-menu'

function render() {
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
  const { content, menu } = render()
  expect(menu.hidden).toBe(true)
  content.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 100,
      clientY: 200,
    }),
  )
  expect(menu.hidden).toBe(false)
  expect(menu.style.left).toBe('100px')
  expect(menu.style.top).toBe('200px')
})

test('hides the menu', async () => {
  const { menu } = render()
  menu.hidden = false
  document.body.click()
  expect(menu.hidden).toBe(true)
})
