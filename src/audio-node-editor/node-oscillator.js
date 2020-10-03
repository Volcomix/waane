import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import useAudioOutputBinding from './use-audio-output-binding.js'

export default defineCustomElement('node-oscillator', {
  template: html`
    <w-graph-node>
      <span slot="title">Oscillator</span>
      <w-graph-node-output>Output</w-graph-node-output>
    </w-graph-node>
  `,
  shadow: false,
  setup({ host, connected, disconnected }) {
    const audioContext = useAudioContext()
    const oscillator = audioContext.createOscillator()

    const bindAudioOutput = useAudioOutputBinding(host)

    connected(() => {
      oscillator.start()

      const output = /** @type {HTMLElement} */ (host.querySelector(
        'w-graph-node-output',
      ))

      bindAudioOutput(output, oscillator)
    })

    disconnected(() => {
      oscillator.stop()
    })
  },
})
