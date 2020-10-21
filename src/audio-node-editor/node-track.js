import { defineCustomElement, html } from '../shared/core/element.js'

export default defineCustomElement('node-track', {
  template: html`
    <w-graph-node>
      <span slot="title">Track</span>
      <w-graph-node-output type="envelope">On</w-graph-node-output>
    </w-graph-node>
  `,
  shadow: false,
})
