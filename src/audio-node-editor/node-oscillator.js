import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'

/**
 * @typedef {import('../shared/base/select.js').default} Select
 * @typedef {import('../shared/base/number-field.js').default} NumberField
 */

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
  setup({ host, connected, disconnected }) {
    const audioContext = useAudioContext()
    const oscillator = audioContext.createOscillator()

    connected(() => {
      const typeField = /** @type {Select} */ (host.querySelector(
        `w-select[label='Type']`,
      ))
      const frequencyField = /** @type {NumberField} */ (host.querySelector(
        `w-number-field[label='Frequency']`,
      ))
      const detuneField = /** @type {NumberField} */ (host.querySelector(
        `w-number-field[label='Detune']`,
      ))

      typeField.value = oscillator.type
      frequencyField.value = oscillator.frequency.value
      detuneField.value = oscillator.detune.value

      oscillator.start()

      bindAudioOutput(host.querySelector('w-graph-node-output'), oscillator)
      bindAudioInput(
        frequencyField.closest('w-graph-node-input'),
        oscillator.frequency,
      )
      bindAudioInput(
        detuneField.closest('w-graph-node-input'),
        oscillator.detune,
      )

      typeField.addEventListener('change', () => {
        oscillator.type = /** @type {OscillatorType} */ (typeField.value)
      })

      frequencyField.addEventListener('input', () => {
        oscillator.frequency.value = frequencyField.value
      })

      detuneField.addEventListener('input', () => {
        oscillator.detune.value = detuneField.value
      })
    })

    disconnected(() => {
      oscillator.stop()
    })
  },
})
