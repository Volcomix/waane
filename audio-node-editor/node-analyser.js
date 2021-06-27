import { defineCustomElement, html } from '../shared/core/element.js'
import { nextId } from '../shared/helpers/id.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'

const period = 2

const colors = [
  [0, 0, 128, 0],
  [0, 0, 128, 255],
  [0, 128, 255, 255],
  [0, 255, 0, 255],
  [255, 255, 0, 255],
  [255, 128, 0, 255],
  [255, 0, 0, 255],
]

/**
 * @param {number} value
 */
function getColor(value) {
  const colorPosition = ((colors.length - 1) * value) / 256
  const colorIndex = Math.floor(colorPosition)
  const positionInColor = colorPosition - colorIndex
  const [r1, g1, b1, a1] = colors[colorIndex]
  const [r2, g2, b2, a2] = colors[colorIndex + 1]
  return [
    Math.min(r1, r2) + Math.abs(r1 - r2) * positionInColor,
    Math.min(g1, g2) + Math.abs(g1 - g2) * positionInColor,
    Math.min(b1, b2) + Math.abs(b1 - b2) * positionInColor,
    Math.min(a1, a2) + Math.abs(a1 - a2) * positionInColor,
  ]
}

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
      for (let i = 0; i < frequencyData.length; i++) {
        const y = 4 * (frequencyData.length - i - 1)
        const [r, g, b, a] = getColor(frequencyData[i])
        newColumn.data[y] = r
        newColumn.data[y + 1] = g
        newColumn.data[y + 2] = b
        newColumn.data[y + 3] = a
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
      canvas.width = period * 60
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
