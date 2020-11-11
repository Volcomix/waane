import { css, defineCustomElement, html } from './shared/core/element.js'

const playTooltip = 'Play'
const pauseTooltip = 'Pause'

export default defineCustomElement('button-play-pause', {
  styles: css`
    :host {
      position: relative;
    }

    w-tooltip {
      transition: opacity 200ms var(--easing-standard), transform 200ms var(--easing-standard);
    }

    w-tooltip[text='${pauseTooltip}'] {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    :host([active]) w-tooltip[text='${playTooltip}'] {
      opacity: 0;
      transform: rotate(90deg);
    }

    :host(:not([active])) w-tooltip[text='${pauseTooltip}'] {
      opacity: 0;
      transform: rotate(-90deg);
      pointer-events: none;
    }
  `,
  template: html`
    <w-tooltip text="${playTooltip}">
      <w-button>
        <w-icon>play_arrow</w-icon>
      </w-button>
    </w-tooltip>
    <w-tooltip text="${pauseTooltip}">
      <w-button>
        <w-icon>pause</w-icon>
      </w-button>
    </w-tooltip>
  `,
  properties: {
    active: Boolean,
  },
})
