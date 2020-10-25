import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'
import createAudioNode from './use-audio-node.js'

const typeLabel = 'Type'
const frequencyLabel = 'Frequency'
const detuneLabel = 'Detune'
const QLabel = 'Q'
const gainLabel = 'Gain'

export default defineCustomElement('node-biquad-filter', {
  template: html`
    <w-graph-node>
      <span slot="title">Biquad filter</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
      <w-select label="${typeLabel}">
        <w-menu-item value="lowpass">Lowpass</w-menu-item>
        <w-menu-item value="highpass">Highpass</w-menu-item>
        <w-menu-item value="bandpass">Bandpass</w-menu-item>
        <w-menu-item value="lowshelf">Lowshelf</w-menu-item>
        <w-menu-item value="highshelf">Highshelf</w-menu-item>
        <w-menu-item value="peaking">Peaking</w-menu-item>
        <w-menu-item value="notch">Notch</w-menu-item>
        <w-menu-item value="allpass">Allpass</w-menu-item>
      </w-select>
      <w-graph-node-input>
        <w-number-field label="${frequencyLabel}"></w-number-field>
      </w-graph-node-input>
      <w-graph-node-input>
        <w-number-field label="${detuneLabel}"></w-number-field>
      </w-graph-node-input>
      <w-graph-node-input>
        <w-number-field label="${QLabel}"></w-number-field>
      </w-graph-node-input>
      <w-graph-node-input>
        <w-number-field label="${gainLabel}"></w-number-field>
      </w-graph-node-input>
      <w-graph-node-input type="audio">Input</w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  properties: {
    type: String,
    frequency: Number,
    detune: Number,
    Q: Number,
    gain: Number,
  },
  setup: createAudioNode(
    ({ host, connected, useAudioProperty, useAudioParam }) => {
      const audioContext = useAudioContext()
      const biquadFilter = audioContext.createBiquadFilter()

      connected(() => {
        bindAudioOutput(host.querySelector('w-graph-node-output'), biquadFilter)
        useAudioProperty(
          host.querySelector(`w-select[label='${typeLabel}']`),
          biquadFilter,
          'type',
        )
        useAudioParam(
          host.querySelector(`w-number-field[label='${frequencyLabel}']`),
          biquadFilter,
          'frequency',
        )
        useAudioParam(
          host.querySelector(`w-number-field[label='${detuneLabel}']`),
          biquadFilter,
          'detune',
        )
        useAudioParam(
          host.querySelector(`w-number-field[label='${QLabel}']`),
          biquadFilter,
          'Q',
        )
        useAudioParam(
          host.querySelector(`w-number-field[label='${gainLabel}']`),
          biquadFilter,
          'gain',
        )
        bindAudioInput(
          host.querySelector('w-graph-node-input:last-of-type'),
          biquadFilter,
        )
      })
    },
  ),
})
