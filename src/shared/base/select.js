import { css, defineCustomElement, html } from '../core/element.js'
import typography from '../core/typography.js'

/**
 * @typedef {import('./menu.js').default} Menu
 * @typedef {import('./menu-item.js').default} MenuItem
 */

export default defineCustomElement('w-select', {
  styles: css`
    :host {
      position: relative;
      height: 48px;
      flex: 1;
      display: flex;
      border-bottom: 1px solid rgba(var(--color-on-surface) / 0.42);
      border-radius: 4px 4px 0 0;
      background-color: rgba(var(--color-on-surface) / 0.04);
      transition: border-bottom-color 200ms var(--easing-standard);
    }

    label {
      position: absolute;
      top: 20px;
      left: 16px;
      transform: translateY(-100%) scale(0.75);
      transform-origin: bottom left;
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      pointer-events: none;
      transition: color 200ms var(--easing-standard),
        transform 200ms var(--easing-standard);
      ${typography('body1')}
    }

    span {
      position: absolute;
      top: 1px;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 20px 48px 6px 16px;
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
      ${typography('body1')}
    }

    input {
      flex: 1;
      outline: none;
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: 4px 4px 0 0;
      margin-bottom: -1px;
      padding: 20px 48px 6px 16px;
      background: none;
      color: transparent;
      cursor: pointer;
      transition: background-color 200ms var(--easing-standard),
        border-bottom-color 200ms var(--easing-standard);
      ${typography('body1')}
    }

    w-icon {
      position: absolute;
      right: 0;
      height: 100%;
      margin: 0 12px;
      display: flex;
      align-items: center;
      pointer-events: none;
      transition: color 200ms var(--easing-standard),
        transform 200ms var(--easing-standard);
    }

    w-menu {
      position: absolute;
      top: 100%;
      width: 100%;
      margin-top: 1px;
    }

    :host(:hover) {
      border-bottom-color: rgba(
        var(--color-on-surface) / var(--text-high-emphasis)
      );
    }

    input:hover {
      background-color: rgba(var(--color-on-surface) / 0.04);
    }

    input:focus {
      border-bottom-color: rgb(var(--color-primary));
      background-color: rgba(var(--color-on-surface) / 0.08);
    }

    input:focus + label {
      color: rgba(var(--color-primary) / var(--text-high-emphasis));
    }

    :host(:focus-within) w-icon {
      color: rgb(var(--color-primary));
    }

    w-menu[open] + w-icon {
      transform: rotate(180deg);
    }
  `,
  template: html`
    <span></span>
    <input id="input" readonly />
    <label for="input"></label>
    <w-menu><slot></slot></w-menu>
    <w-icon>arrow_drop_down</w-icon>
  `,
  properties: {
    label: String,
    value: String,
  },
  setup({ host, observe }) {
    const label = host.shadowRoot.querySelector('label')
    const span = host.shadowRoot.querySelector('span')
    const input = host.shadowRoot.querySelector('input')
    const menu = /** @type {Menu} */ (host.shadowRoot.querySelector('w-menu'))
    const menuSlot = menu.querySelector('slot')

    /** @type {boolean} */
    let isMenuOpenOnMouseDown

    observe('label', () => {
      label.textContent = host.label
    })

    observe('value', () => {
      input.value = host.value
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
        input.dispatchEvent(new Event('change', { composed: true }))
      }
    })
  },
})
