import { css, defineCustomElement, html } from '../shared/core/element.js'
import useKeyboardNavigation from './use-keyboard-navigation.js'

/**
 * @typedef {import('../shared/base/number-field.js').default} NumberField
 * @typedef {import('../shared/base/menu.js').default} Menu
 * @typedef {import('./audio-track.js').default} AudioTrack
 * @typedef {import('./track-effect.js').default} TrackEffect
 */

const tempoLabel = 'Tempo'
const linesLabel = 'Lines'
const linesPerBeatLabel = 'Lines per beat'

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

    .root {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      background-color: rgb(var(--color-surface));
      opacity: 0;
      transform: translateX(-100px);
      transition: opacity 150ms var(--easing-accelerated), transform 150ms var(--easing-accelerated);
    }

    :host([active]) .root {
      opacity: 1;
      transform: none;
      transition-timing-function: var(--easing-decelerated), var(--easing-decelerated);
    }

    aside {
      margin: 32px 16px 16px 16px;
      width: 160px;
      display: flex;
      flex-direction: column;
    }

    .tracks {
      flex: 1;
      display: flex;
      align-items: flex-start;
      overflow: auto;
    }

    .tracks > *:last-child::after {
      content: '';
      position: absolute;
      right: -16px;
      bottom: -16px;
      width: 1px;
      height: 1px;
    }
  `,
  template: html`
    <w-fab>
      <w-icon>add</w-icon>
      Add track
    </w-fab>
    <div class="root">
      <aside>
        <w-number-field label="${tempoLabel}"></w-number-field>
        <w-number-field label="${linesLabel}"></w-number-field>
        <w-number-field label="${linesPerBeatLabel}"></w-number-field>
      </aside>
      <div class="tracks"></div>
    </div>
    <w-menu>
      <w-menu-item id="delete">
        <w-icon>delete</w-icon>
        <span>Delete track</span>
      </w-menu-item>
    </w-menu>
  `,
  properties: {
    active: Boolean,
    tempo: Number,
    lines: Number,
    linesPerBeat: Number,
  },
  setup({ host, observe }) {
    /** @type {HTMLElement} */
    const fab = host.shadowRoot.querySelector('w-fab')

    /** @type {HTMLElement} */
    const tracks = host.shadowRoot.querySelector('.tracks')

    /** @type {NumberField} */
    const tempoField = host.shadowRoot.querySelector(`w-number-field[label='${tempoLabel}']`)

    /** @type {NumberField} */
    const linesField = host.shadowRoot.querySelector(`w-number-field[label='${linesLabel}']`)

    /** @type {NumberField} */
    const linesPerBeatField = host.shadowRoot.querySelector(`w-number-field[label='${linesPerBeatLabel}']`)

    /** @type {Menu} */
    const menu = host.shadowRoot.querySelector('w-menu')

    /** @type {HTMLElement} */
    const menuItemDelete = host.shadowRoot.querySelector('#delete')

    useKeyboardNavigation(tracks)

    /** @type {AudioTrack} */
    let selectedAudioTrack = null

    observe('tempo', () => {
      tempoField.value = host.tempo
    })

    observe('lines', () => {
      linesField.value = host.lines
      tracks.querySelectorAll('audio-track').forEach((audioTrack) => {
        const trackEffects = audioTrack.querySelectorAll('track-effect')
        if (trackEffects.length < host.lines) {
          for (let i = trackEffects.length; i < host.lines; i++) {
            const trackEffect = /** @type {TrackEffect} */ (document.createElement('track-effect'))
            trackEffect.beat = i % host.linesPerBeat === 0
            audioTrack.appendChild(trackEffect)
          }
        } else {
          trackEffects.forEach((trackEffect, i) => {
            if (i >= host.lines) {
              trackEffect.remove()
            }
          })
        }
      })
    })

    observe('linesPerBeat', () => {
      linesPerBeatField.value = host.linesPerBeat
      tracks.querySelectorAll('audio-track').forEach((audioTrack) => {
        audioTrack.querySelectorAll('track-effect').forEach((/** @type {TrackEffect} */ trackEffect, i) => {
          trackEffect.beat = i % host.linesPerBeat === 0
        })
      })
    })

    fab.addEventListener('click', () => {
      const audioTrack = /** @type {AudioTrack} */ (document.createElement('audio-track'))
      for (let i = 0; i < host.lines; i++) {
        const trackEffect = /** @type {TrackEffect} */ (document.createElement('track-effect'))
        trackEffect.beat = i % host.linesPerBeat === 0
        audioTrack.appendChild(trackEffect)
      }
      tracks.appendChild(audioTrack)
    })

    tempoField.addEventListener('input', () => {
      host.tempo = tempoField.value
    })

    linesField.addEventListener('input', () => {
      host.lines = linesField.value
    })

    linesPerBeatField.addEventListener('input', () => {
      host.linesPerBeat = linesPerBeatField.value
    })

    tracks.addEventListener('contextmenu', (event) => {
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
