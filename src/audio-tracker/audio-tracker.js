import { css, defineCustomElement, html } from '../shared/core/element.js'

/**
 * @typedef {import('./audio-track.js').default} AudioTrack
 * @typedef {import('./track-effect.js').default} TrackEffect
 */

export default defineCustomElement('audio-tracker', {
  styles: css`
    :host {
      position: relative;
    }

    div {
      box-sizing: border-box;
      height: 100%;
      padding: 40px 16px 16px 16px;
      display: flex;
      align-items: flex-start;
      background-color: rgb(var(--color-surface));
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
    <div>
      <audio-track label="1">
        <track-effect value="FF"></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect value="FF"></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect value="88"></track-effect>
      </audio-track>
      <audio-track label="2">
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect value="FF"></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect value="FF"></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
        <track-effect></track-effect>
      </audio-track>
      <audio-track label="3">
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
        <track-effect value="88"></track-effect>
        <track-effect></track-effect>
      </audio-track>
    </div>
  `,
  setup({ host }) {
    const fab = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-fab',
    ))
    const div = host.shadowRoot.querySelector('div')

    host.shadowRoot.querySelectorAll('audio-track').forEach((audioTrack) => {
      audioTrack.querySelectorAll('track-effect').forEach((
        /** @type {TrackEffect} */ trackEffect,
        i,
      ) => {
        trackEffect.beat = i % 4 === 0
      })
    })

    let trackIndex = 4

    fab.addEventListener('click', () => {
      const audioTrack = /** @type {AudioTrack} */ (document.createElement(
        'audio-track',
      ))
      audioTrack.label = `${trackIndex++}`
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
