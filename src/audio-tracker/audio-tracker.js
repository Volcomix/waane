import { css, defineCustomElement, html } from '../shared/core/element.js'

/**
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
  `,
  setup({ host }) {
    const fab = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-fab',
    ))
    const div = host.shadowRoot.querySelector('div')

    let trackId = 1

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
  },
})
