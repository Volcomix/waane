import { css, defineCustomElement, html } from '../core/element.js'
import typography from '../core/typography.js'

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

    input {
      flex: 1;
      outline: none;
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: 4px 4px 0 0;
      margin-bottom: -1px;
      padding: 20px 16px 6px 16px;
      background: none;
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
      cursor: pointer;
      transition: background-color 200ms var(--easing-standard),
        border-bottom-color 200ms var(--easing-standard);
      ${typography('body1')}
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
      background-color: rgba(var(--color-on-surface) / 0.12);
    }

    input:focus + label {
      color: rgba(var(--color-primary) / var(--text-high-emphasis));
    }
  `,
  template: html`
    <input id="input" readonly />
    <label for="input"></label>
    <w-menu><slot></slot></w-menu>
  `,
  properties: {
    label: String,
    value: String,
  },
  setup({ host, observe }) {
    const label = host.shadowRoot.querySelector('label')
    const input = host.shadowRoot.querySelector('input')
    const menu = /** @type {import('./menu.js').default} */ (host.shadowRoot.querySelector(
      'w-menu',
    ))

    /** @type {boolean} */
    let isMenuOpenOnMouseDown

    observe('label', () => {
      label.textContent = host.label
    })

    observe('value', () => {
      input.value = host.value
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

      const menuItem = /** @type {import('./menu-item.js').default} */ (event.target)
      if (menuItem.value != null) {
        host.value = menuItem.value
        input.dispatchEvent(new Event('change', { composed: true }))
      }
    })
  },
})
