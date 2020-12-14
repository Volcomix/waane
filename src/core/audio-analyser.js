import { css, defineCustomElement, html } from '../shared/core/element.js'

defineCustomElement('audio-analyser', {
  styles: css`
    :host {
      height: 100%;
      display: flex;
    }

    canvas {
      flex: 1;
    }
  `,
  template: html`<canvas></canvas>`,
  setup({ host }) {
    const canvas = host.shadowRoot.querySelector('canvas')
    canvas.width = 10 * 60
    canvas.height = 1024
  },
})
