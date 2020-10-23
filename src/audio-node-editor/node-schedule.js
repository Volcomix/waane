import { defineCustomElement, html } from '../shared/core/element.js'

export default defineCustomElement('node-schedule', {
  template: html`
    <w-graph-node>
      <span slot="title">Schedule</span>
      <w-graph-node-output type="trigger">Envelope</w-graph-node-output>
      <w-number-field label="Target value" value="1"></w-number-field>
      <w-number-field label="Start time" value="0"></w-number-field>
      <w-number-field label="Time constant" value="0"></w-number-field>
      <w-graph-node-input type="trigger">Trigger</w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
})
