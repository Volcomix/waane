import { css, defineCustomElement, html } from '../core/element.js'

/**
 * @typedef {import('./menu.js').default} Menu
 * @typedef {import('./menu-item.js').default} MenuItem
 * @typedef {import('./text-field.js').default} TextField
 */

export default defineCustomElement('w-select', {
  styles: css`
    :host {
      position: relative;
    }

    w-menu {
      position: absolute;
      top: 100%;
      width: 100%;
    }

    w-text-field {
      cursor: pointer;
    }

    w-icon {
      transition: transform 250ms var(--easing-standard);
    }

    w-menu[open] + w-text-field w-icon {
      transform: rotate(180deg);
    }
  `,
  template: html`
    <w-menu><slot></slot></w-menu>
    <w-text-field type="select">
      <span></span>
      <w-icon slot="trailing">arrow_drop_down</w-icon>
    </w-text-field>
  `,
  properties: {
    label: String,
    value: String,
  },
  setup({ host, observe }) {
    const menu = /** @type {Menu} */ (host.shadowRoot.querySelector('w-menu'))
    const menuSlot = menu.querySelector('slot')
    const textField = /** @type {TextField} */ (host.shadowRoot.querySelector(
      'w-text-field',
    ))
    const span = host.shadowRoot.querySelector('span')

    /** @type {boolean} */
    let isMenuOpenOnMouseDown

    observe('label', () => {
      textField.label = host.label
    })

    observe('value', () => {
      textField.value = host.value
      menuSlot.assignedElements().forEach((element) => {
        if (!element.matches('w-menu-item')) {
          return
        }
        const menuItem = /** @type {MenuItem} */ (element)
        if (menuItem.value === host.value) {
          span.textContent = menuItem.textContent
          menuItem.selected = true
        } else {
          menuItem.selected = false
        }
      })
    })

    host.addEventListener('mousedown', () => {
      isMenuOpenOnMouseDown = menu.open
    })

    host.addEventListener('click', () => {
      menu.open = !isMenuOpenOnMouseDown
    })

    menu.addEventListener('mousedown', (event) => {
      event.stopPropagation()
    })

    menu.addEventListener('click', (event) => {
      // Prevents a menu item click to reopen the menu
      event.stopPropagation()

      const menuItem = /** @type {MenuItem} */ (event.target)
      if (menuItem.value != null) {
        host.value = menuItem.value
        host.dispatchEvent(new Event('input'))
      }
    })
  },
})
