import { css, defineCustomElement, html } from '../shared/core/element.js'

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
})
