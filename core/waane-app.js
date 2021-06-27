import { defineCustomElement, html } from '../shared/core/element.js'

export default defineCustomElement('waane-app', {
  template: html``,
  setup({ host }) {
    if (location.pathname.endsWith('/analyser')) {
      host.shadowRoot.appendChild(document.createElement('audio-analyser'))
    } else {
      host.shadowRoot.appendChild(document.createElement('audio-editor'))
    }
  },
})
