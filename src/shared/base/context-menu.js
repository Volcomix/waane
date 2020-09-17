import { defineCustomElement, html } from '../core/element.js'

export default defineCustomElement(
  'w-context-menu',
  html`
    <style>
      ::slotted(w-menu) {
        position: fixed;
      }
    </style>
    <slot></slot>
  `,
  {},
  ({ host, connected, disconnected }) => {
    const menu = /** @type {import('./menu.js').default} */ (host.querySelector(
      'w-menu',
    ))
    menu.open = false

    function onBodyClick() {
      menu.open = false
    }

    /**
     * @param {MouseEvent} event
     */
    function setMenuPosition(event) {
      const { width, height } = menu.getBoundingClientRect()
      const x = Math.min(
        event.clientX,
        document.documentElement.clientWidth - width,
      )
      const y = Math.min(
        event.clientY,
        document.documentElement.clientHeight - height,
      )
      menu.style.left = `${x}px`
      menu.style.top = `${y}px`
    }

    connected(() => {
      document.body.addEventListener('click', onBodyClick)
    })
    disconnected(() => {
      document.body.removeEventListener('click', onBodyClick)
    })
    host.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      menu.open = true
      setMenuPosition(event)
    })
  },
)
