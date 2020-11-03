import { css, defineCustomElement, html } from '../shared/core/element.js'

/**
 * @typedef {import('../shared/base/menu').default} Menu
 * @typedef {import('./audio-track.js').default} AudioTrack
 * @typedef {import('./track-effect.js').default} TrackEffect
 */

export default defineCustomElement('audio-tracker', {
  styles: css`
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

    w-fab {
      position: absolute;
      left: 8px;
      transform: translateY(-50%);
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
  setup({ host }) {
    const fab = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-fab',
    ))
    const div = host.shadowRoot.querySelector('div')
    const menu = /** @type {Menu} */ (host.shadowRoot.querySelector('w-menu'))
    const menuItemDelete = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      '#delete',
    ))

    let trackId = 1

    /** @type {HTMLElement} */
    let selectedAudioTrack

    fab.addEventListener('click', () => {
      const audioTrack = /** @type {AudioTrack} */ (document.createElement(
        'audio-track',
      ))
      audioTrack.label = `${trackId++}`
      for (let i = 0; i < 16; i++) {
        const trackEffect = /** @type {TrackEffect} */ (document.createElement(
          'track-effect',
        ))
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
      // TODO remove selection in track nodes on node editor
      selectedAudioTrack.remove()
    })
  },
})
