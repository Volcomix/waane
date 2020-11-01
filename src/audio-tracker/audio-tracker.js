import { css, defineCustomElement, html } from '../shared/core/element.js'

export default defineCustomElement('audio-tracker', {
  styles: css`
    div {
      margin: 16px;
      display: flex;
    }
  `,
  template: html`
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
