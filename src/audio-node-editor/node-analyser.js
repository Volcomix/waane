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
    analyser.smoothingTimeConstant = 0
    const frequencyData = new Uint8Array(analyser.frequencyBinCount)

    const analyserId = `analyser-${nextId('analyser')}`

    /** @type {Window} */
    let analyserWindow = null

    /** @type {number} */
    let analyseRequestId = null

    /** @type {HTMLCanvasElement} */
    let canvas = null

    /** @type {CanvasRenderingContext2D} */
    let canvasContext = null

    function analyse() {
      analyseRequestId = analyserWindow.requestAnimationFrame(analyse)

      analyser.getByteFrequencyData(frequencyData)
      const x = canvas.width - 1
      const previousImageData = canvasContext.getImageData(1, 0, x, canvas.height)
      canvasContext.putImageData(previousImageData, 0, 0)
      const newColumn = canvasContext.getImageData(x, 0, 1, canvas.height)
      for (let y = 0; y < frequencyData.length; y++) {
        newColumn.data[frequencyData.length - y - 1] = frequencyData[y]
      }
      canvasContext.putImageData(newColumn, x, 0)
    }

    function closeAnalyserWindow() {
      if (analyserWindow) {
        analyserWindow.close()
      }
    }

    function handleAnalyserWindowUnload() {
      analyserWindow.cancelAnimationFrame(analyseRequestId)
      analyserWindow = null
      canvas = null
      canvasContext = null
    }

    function handleAnalyserWindowLoad() {
      const waaneApp = analyserWindow.document.body.querySelector('waane-app')
      const audioAnalyser = waaneApp.shadowRoot.querySelector('audio-analyser')
      canvas = audioAnalyser.shadowRoot.querySelector('canvas')
      canvas.width = 10 * 60
      canvas.height = analyser.frequencyBinCount
      canvasContext = canvas.getContext('2d')
      analyse()

      analyserWindow.addEventListener('unload', handleAnalyserWindowUnload)
    }

    connected(() => {
      /** @type {HTMLElement} */
      const button = host.querySelector('w-button')

      bindAudioOutput(host.querySelector('w-graph-node-output'), analyser)
      bindAudioInput(host.querySelector('w-graph-node-input'), analyser)

      window.addEventListener('unload', closeAnalyserWindow)

      button.addEventListener('click', () => {
        if (analyserWindow === null) {
          analyserWindow = window.open('analyser', analyserId, 'width=800,height=600')
          analyserWindow.addEventListener('load', handleAnalyserWindowLoad)
        } else {
          analyserWindow.focus()
        }
      })
    })

    disconnected(() => {
      closeAnalyserWindow()
      window.removeEventListener('unload', closeAnalyserWindow)
    })
  },
})
