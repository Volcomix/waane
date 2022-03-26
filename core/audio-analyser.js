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
})
