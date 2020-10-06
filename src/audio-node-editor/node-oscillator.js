import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'

export default defineCustomElement('node-oscillator', {
  template: html`
    <w-graph-node>
      <span slot="title">Oscillator</span>
      <w-graph-node-output>Output</w-graph-node-output>
      <w-graph-node-input>
        <w-number-field label="Frequency"></w-number-field>
      </w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  setup({ host, connected, disconnected }) {
    const audioContext = useAudioContext()
    const oscillator = audioContext.createOscillator()

    connected(() => {
      const frequencyField = /** @type {import('../shared/base/number-field.js').default} */ (host.querySelector(
        'w-number-field',
      ))

      frequencyField.value = oscillator.frequency.value

      oscillator.start()

      bindAudioOutput(host.querySelector('w-graph-node-output'), oscillator)
      bindAudioInput(
        host.querySelector('w-graph-node-input'),
        oscillator.frequency,
      )

      frequencyField.addEventListener('input', () => {
        if (isFinite(frequencyField.value)) {
          oscillator.frequency.value = frequencyField.value
        }
      })
    })

    disconnected(() => {
      oscillator.stop()
    })
  },
})
