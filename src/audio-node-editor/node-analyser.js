import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'

export default defineCustomElement('node-analyser', {
  template: html`
    <w-graph-node>
      <span slot="title">Analyser</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
      <w-button><w-icon>open_in_new</w-icon>Open</w-button>
      <w-graph-node-input type="audio">Input</w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  setup({ host, connected }) {
    const audioContext = useAudioContext()
    const analyser = audioContext.createAnalyser()

    connected(() => {
      /** @type {HTMLElement} */
      const button = host.querySelector('w-button')

      bindAudioOutput(host.querySelector('w-graph-node-output'), analyser)
      bindAudioInput(host.querySelector('w-graph-node-input'), analyser)

      button.addEventListener('click', () => {
        window.open('analyser')
      })
    })
  },
})
