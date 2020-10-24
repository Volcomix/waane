import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'
import createAudioNode from './use-audio-node.js'

export default defineCustomElement('node-gain', {
  template: html`
    <w-graph-node>
      <span slot="title">Gain</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
      <w-graph-node-input>
        <w-number-field label="Gain"></w-number-field>
      </w-graph-node-input>
      <w-graph-node-input type="audio">Input</w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  properties: {
    gain: Number,
  },
  setup: createAudioNode(({ host, connected, useAudioParam }) => {
    const audioContext = useAudioContext()
    const gain = audioContext.createGain()

    connected(() => {
      bindAudioOutput(host.querySelector('w-graph-node-output'), gain)
      useAudioParam(
        host.querySelector(`w-number-field[label='Gain']`),
        gain,
        'gain',
      )
      bindAudioInput(
        host.querySelector('w-graph-node-input:last-of-type'),
        gain,
      )
    })
  }),
})
