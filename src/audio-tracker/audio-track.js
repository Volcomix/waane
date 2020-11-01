import { css, defineCustomElement } from '../shared/core/element.js'

const link = document.createElement('link')
link.href =
  'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

export default defineCustomElement('audio-track', {
  styles: css`
    :host {
      position: relative;
      border: 1px solid rgba(var(--color-on-surface) / 0.42);
      border-radius: 4px;
      margin-right: 8px;
      padding: 4px 0;
      display: flex;
      flex-direction: column;
      transition: border-color 200ms var(--easing-standard);
    }

    :host(:hover) {
      border-color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }

    :host::after {
      content: '';
      position: absolute;
      top: -1px;
      right: -1px;
      bottom: -1px;
      left: -1px;
      border: 2px solid transparent;
      border-radius: 4px;
      pointer-events: none;
      transition: border-color 200ms var(--easing-standard);
    }

    :host(:focus-within)::after {
      border-color: rgb(var(--color-primary));
    }

    ::slotted(:nth-child(4n + 1)) {
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }
  `,
})
