import { defineCustomElement, html } from '../shared/core/element.js'

/**
 * @typedef {import('../shared/base/file.js').FileLoadEvent} FileLoadEvent
 */

export default defineCustomElement('node-audio-file', {
  template: html`
    <w-graph-node>
      <span slot="title">Audio file</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
      <w-file></w-file>
    </w-graph-node>
  `,
  shadow: false,
  setup({ host, connected }) {
    connected(() => {
      const fileInput = host.querySelector('w-file')

      fileInput.addEventListener('file-load', (/** @type {FileLoadEvent} */ event) => {
        console.log(event.detail.name, event.detail.content)
      })
    })
  },
})
