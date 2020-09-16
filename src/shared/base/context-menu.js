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
  ({ host, connected, disconnected }) => {
    const menu = /** @type {HTMLElement} */ (host.querySelector('w-menu'))
    menu.hidden = true

    function onBodyClick() {
      menu.hidden = true
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
      menu.hidden = false
      setMenuPosition(event)
    })
  },
)
