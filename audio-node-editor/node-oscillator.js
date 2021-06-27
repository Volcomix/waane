import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioOutput } from './use-audio-link.js'
import createAudioNode from './use-audio-node.js'

const typeLabel = 'Type'
const frequencyLabel = 'Frequency'
const detuneLabel = 'Detune'

export default defineCustomElement('node-oscillator', {
  template: html`
    <w-graph-node>
      <span slot="title">Oscillator</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
      <w-select label="${typeLabel}">
        <w-menu-item value="sine">Sine</w-menu-item>
        <w-menu-item value="square">Square</w-menu-item>
        <w-menu-item value="sawtooth">Sawtooth</w-menu-item>
        <w-menu-item value="triangle">Triangle</w-menu-item>
      </w-select>
      <w-graph-node-input>
        <w-number-field label="${frequencyLabel}"></w-number-field>
      </w-graph-node-input>
      <w-graph-node-input>
        <w-number-field label="${detuneLabel}"></w-number-field>
      </w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  properties: {
    type: String,
    frequency: Number,
    detune: Number,
  },
  setup: createAudioNode(({ host, connected, disconnected, useAudioProperty, useAudioParam }) => {
    const audioContext = useAudioContext()
    const oscillator = audioContext.createOscillator()

    connected(() => {
      bindAudioOutput(host.querySelector('w-graph-node-output'), oscillator)
      useAudioProperty(host.querySelector(`w-select[label='${typeLabel}']`), oscillator, 'type')
      useAudioParam(host.querySelector(`w-number-field[label='${frequencyLabel}']`), oscillator, 'frequency')
      useAudioParam(host.querySelector(`w-number-field[label='${detuneLabel}']`), oscillator, 'detune')
      oscillator.start()
    })

    disconnected(() => {
      oscillator.stop()
    })
  }),
})
