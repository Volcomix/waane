import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'

/**
 * @typedef {import('../shared/base/file.js').FileLoadEvent} FileLoadEvent
 */

export default defineCustomElement('node-audio-file', {
  template: html`
    <w-graph-node>
      <span slot="title">Audio file</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
      <w-file></w-file>
      <w-graph-node-input type="trigger">Trigger</w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  setup({ host, connected }) {
    const audioContext = useAudioContext()

    /** @type {Set<AudioNode>} */
    const destinations = new Set()

    /** @type {AudioBuffer} */
    let audioBuffer = null

    /** @type {AudioBufferSourceNode} */
    let bufferSource = null

    const audioFile = {
      /**
       * @param {number} time
       */
      trigger(time) {
        if (audioBuffer === null) {
          return
        }
        if (bufferSource !== null) {
          bufferSource.stop(time)
        }
        bufferSource = audioContext.createBufferSource()
        bufferSource.buffer = audioBuffer
        destinations.forEach((destination) => bufferSource.connect(destination))
        bufferSource.start(time)
      },

      /**
       * @param {AudioNode} destination
       */
      connect(destination) {
        destinations.add(destination)
      },

      disconnect() {
        destinations.clear()
      },
    }

    connected(() => {
      const fileInput = host.querySelector('w-file')

      bindAudioOutput(host.querySelector('w-graph-node-output'), audioFile)
      bindAudioInput(host.querySelector('w-graph-node-input'), audioFile)

      fileInput.addEventListener('file-load', async (event) => {
        const fileLoadEvent = /** @type {FileLoadEvent} */ (event)
        audioBuffer = await audioContext.decodeAudioData(fileLoadEvent.detail.content)
      })
    })
  },
})
