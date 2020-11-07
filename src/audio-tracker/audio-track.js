import { css, defineCustomElement, html } from '../shared/core/element.js'
import typography from '../shared/core/typography.js'
import { deregisterAudioTrack, registerAudioTrack } from './use-audio-track.js'

const link = document.createElement('link')
link.href =
  'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

export default defineCustomElement('audio-track', {
  styles: css`
    :host,
    div {
      border: 1px solid rgba(var(--color-on-surface) / 0.42);
    }

    :host {
      position: relative;
      border-top: none;
      border-radius: 0 0 4px 4px;
      margin: 17px 8px 0 0;
      padding-bottom: 8px;
      display: flex;
      flex-direction: column;
    }

    div {
      position: sticky;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1;
      height: 16px;
      margin: -17px -1px 0 -1px;
      border-bottom: none;
      border-radius: 4px 4px 0 0;
    }

    :host(:hover),
    :host(:hover) div {
      border-color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }

    :host::before,
    div::before {
      content: '';
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      border: 2px solid transparent;
      pointer-events: none;
      transition: border-color 200ms var(--easing-standard);
    }

    :host::before {
      top: 0;
      border-top: none;
      border-radius: 0 0 4px 4px;
    }

    div::before {
      bottom: 0;
      border-bottom: none;
      border-radius: 4px 4px 0 0;
    }

    :host(:focus-within)::before,
    :host(:focus-within) div::before {
      border-color: rgb(var(--color-primary));
    }

    label {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 0 4px;
      background-color: rgb(var(--color-surface));
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      transition: color 200ms var(--easing-standard);
      ${typography('caption')}
    }

    :host(:focus-within) label {
      color: rgba(var(--color-primary) / var(--text-high-emphasis));
    }
  `,
  template: html`
    <div><label></label></div>
    <slot></slot>
  `,
  properties: {
    label: String,
  },
  setup({ host, connected, disconnected, observe }) {
    const label = host.shadowRoot.querySelector('label')

    connected(() => {
      registerAudioTrack(host)
    })

    disconnected(() => {
      deregisterAudioTrack(host)
    })

    observe('label', () => {
      label.textContent = host.label
    })
  },
})
