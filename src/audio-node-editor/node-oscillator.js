import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioOutput } from './use-audio-link.js'
import createAudioNode from './use-audio-node.js'

export default defineCustomElement('node-oscillator', {
  template: html`
    <w-graph-node>
      <span slot="title">Oscillator</span>
      <w-graph-node-output>Output</w-graph-node-output>
      <w-select label="Type">
        <w-menu-item value="sine">Sine</w-menu-item>
        <w-menu-item value="square">Square</w-menu-item>
        <w-menu-item value="sawtooth">Sawtooth</w-menu-item>
        <w-menu-item value="triangle">Triangle</w-menu-item>
      </w-select>
      <w-graph-node-input>
        <w-number-field label="Frequency"></w-number-field>
      </w-graph-node-input>
      <w-graph-node-input>
        <w-number-field label="Detune"></w-number-field>
      </w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  setup: createAudioNode(
    ({ host, connected, disconnected, useAudioProperty, useAudioParam }) => {
      const audioContext = useAudioContext()
      const oscillator = audioContext.createOscillator()

      connected(() => {
        bindAudioOutput(host.querySelector('w-graph-node-output'), oscillator)

        useAudioProperty(
          host.querySelector(`w-select[label='Type']`),
          oscillator,
          'type',
        )
        useAudioParam(
          host.querySelector(`w-number-field[label='Frequency']`),
          oscillator,
          'frequency',
        )
        useAudioParam(
          host.querySelector(`w-number-field[label='Detune']`),
          oscillator,
          'detune',
        )
        oscillator.start()
      })

      disconnected(() => {
        oscillator.stop()
      })
    },
  ),
})
