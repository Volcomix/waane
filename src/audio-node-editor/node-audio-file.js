import { defineCustomElement, html } from '../shared/core/element.js'

export default defineCustomElement('node-audio-file', {
  template: html`
    <w-graph-node>
      <span slot="title">Audio file</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
      <w-file></w-file>
    </w-graph-node>
  `,
  shadow: false,
})
