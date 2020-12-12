import { defineCustomElement, html } from '../shared/core/element.js'
import { nextId } from '../shared/helpers/id.js'
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
  setup({ host, connected, disconnected }) {
    const audioContext = useAudioContext()
    const analyser = audioContext.createAnalyser()
    const frequencyData = new Uint8Array(analyser.frequencyBinCount)

    const analyserId = `analyser-${nextId('analyser')}`

    /** @type {Window} */
    let analyserWindow = null

    /** @type {number} */
    let analyseRequestId = null

    function closeAnalyserWindow() {
      if (analyserWindow) {
        analyserWindow.close()
      }
    }

    function analyse() {
      analyseRequestId = requestAnimationFrame(analyse)
      if (!analyserWindow?.document?.body) {
        return
      }
      analyser.getByteFrequencyData(frequencyData)
      const maxDecibel = frequencyData.reduce((max, value) => Math.max(value, max), -Infinity)
      analyserWindow.document.body.innerText = `Max decibel: ${maxDecibel}`
    }

    connected(() => {
      /** @type {HTMLElement} */
      const button = host.querySelector('w-button')

      bindAudioOutput(host.querySelector('w-graph-node-output'), analyser)
      bindAudioInput(host.querySelector('w-graph-node-input'), analyser)

      analyse()

      window.addEventListener('unload', closeAnalyserWindow)

      button.addEventListener('click', () => {
        analyserWindow = window.open('analyser', analyserId, 'width=800,height=600')
      })
    })

    disconnected(() => {
      cancelAnimationFrame(analyseRequestId)
      closeAnalyserWindow()
      window.removeEventListener('unload', closeAnalyserWindow)
    })
  },
})
