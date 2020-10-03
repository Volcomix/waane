import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioInput } from './use-audio-link.js'

export default defineCustomElement('node-audio-destination', {
  template: html`
    <w-graph-node>
      <span slot="title">Audio destination</span>
      <w-graph-node-input>Input</w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  setup({ host, connected }) {
    const audioContext = useAudioContext()

    connected(() => {
      const input = /** @type {HTMLElement} */ (host.querySelector(
        'w-graph-node-input',
      ))

      bindAudioInput(input, audioContext.destination)
    })
  },
})
