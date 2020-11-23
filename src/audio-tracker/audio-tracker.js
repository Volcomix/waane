import { css, defineCustomElement, html } from '../shared/core/element.js'
import useKeyboardNavigation from './use-keyboard-navigation.js'

/**
 * @typedef {import('../shared/base/menu').default} Menu
 * @typedef {import('./audio-track.js').default} AudioTrack
 * @typedef {import('./track-effect.js').default} TrackEffect
 */

export default defineCustomElement('audio-tracker', {
  styles: css`
    w-fab {
      position: absolute;
      left: 8px;
      opacity: 0;
      transform: translateY(-50%) scale(0.3);
      transition: opacity 75ms linear 75ms, transform 150ms var(--easing-accelerated);
      --color-fab: var(--color-secondary);
      --color-on-fab: var(--color-on-secondary);
    }

    :host([active]) w-fab {
      opacity: 1;
      transform: translateY(-50%);
      transition: opacity 75ms linear, transform 150ms var(--easing-decelerated);
    }

    div {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 40px 16px 16px 16px;
      display: flex;
      align-items: flex-start;
      overflow: auto;
      background-color: rgb(var(--color-surface));
      opacity: 0;
      transform: translateX(-100px);
      transition: opacity 150ms var(--easing-accelerated), transform 150ms var(--easing-accelerated);
    }

    :host([active]) div {
      opacity: 1;
      transform: none;
      transition-timing-function: var(--easing-decelerated), var(--easing-decelerated);
    }

    div::before {
      content: '';
      position: fixed;
      right: 0;
      left: 0;
      z-index: 1;
      height: 57px;
      margin-top: -40px;
      background-color: rgb(var(--color-surface));
    }

    div > *:last-child::after {
      content: '';
      position: absolute;
      top: 0;
      right: -16px;
      width: 1px;
      height: 1px;
    }
  `,
  template: html`
    <w-fab>
      <w-icon>add</w-icon>
      Add track
    </w-fab>
    <div></div>
    <w-menu>
      <w-menu-item id="delete">
        <w-icon>delete</w-icon>
        <span>Delete track</span>
      </w-menu-item>
    </w-menu>
  `,
  properties: {
    active: Boolean,
  },
  setup({ host }) {
    /** @type {HTMLElement} */
    const fab = host.shadowRoot.querySelector('w-fab')

    const div = host.shadowRoot.querySelector('div')
    const menu = /** @type {Menu} */ (host.shadowRoot.querySelector('w-menu'))

    /** @type {HTMLElement} */
    const menuItemDelete = host.shadowRoot.querySelector('#delete')

    useKeyboardNavigation(div)

    /** @type {AudioTrack} */
    let selectedAudioTrack = null

    fab.addEventListener('click', () => {
      const audioTrack = /** @type {AudioTrack} */ (document.createElement('audio-track'))
      for (let i = 0; i < 16; i++) {
        const trackEffect = /** @type {TrackEffect} */ (document.createElement('track-effect'))
        trackEffect.beat = i % 4 === 0
        audioTrack.appendChild(trackEffect)
      }
      div.appendChild(audioTrack)
    })

    div.addEventListener('contextmenu', (event) => {
      const element = /** @type {Element} */ (event.target)
      selectedAudioTrack = element.closest('audio-track')
      if (!selectedAudioTrack) {
        return
      }
      menu.open = true
      menu.x = event.clientX
      menu.y = event.clientY
    })

    menuItemDelete.addEventListener('click', () => {
      selectedAudioTrack.remove()
      selectedAudioTrack = null
    })
  },
})
