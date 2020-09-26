import { defineCustomElement, html } from '../shared/core/element.js'

export default defineCustomElement('node-audio-destination', {
  template: html`
    <w-graph-node>
      <span slot="title">Audio destination</span>
      <w-graph-node-input>Input</w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
})
