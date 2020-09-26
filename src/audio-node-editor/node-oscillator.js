import { defineCustomElement, html } from '../shared/core/element.js'

export default defineCustomElement('node-oscillator', {
  template: html`
    <w-graph-node>
      <span slot="title">Oscillator</span>
      <w-graph-node-output>Output</w-graph-node-output>
    </w-graph-node>
  `,
  shadow: false,
})
