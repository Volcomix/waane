import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'

/**
 * @typedef {import('../shared/base/file.js').default} FileInput
 * @typedef {import('../shared/base/file.js').FileLoadEvent} FileLoadEvent
 */

/** @type {Map<string, AudioBuffer>} */
export const audioBuffers = new Map()

/**
 * @param {ArrayBuffer} arrayBuffer
 */
async function computeHash(arrayBuffer) {
  const digest = await crypto.subtle.digest('SHA-256', arrayBuffer)
  return [...new Uint8Array(digest)].map((v) => v.toString(16).padStart(2, '0')).join('')
}

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
  properties: {
    name: String,
    hash: String,
  },
  setup({ host, connected, observe }) {
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
      /** @type {FileInput} */
      const fileInput = host.querySelector('w-file')

      fileInput.name = host.name
      audioBuffer = audioBuffers.get(host.hash)

      bindAudioOutput(host.querySelector('w-graph-node-output'), audioFile)
      bindAudioInput(host.querySelector('w-graph-node-input'), audioFile)

      observe('name', () => {
        fileInput.name = host.name
      })

      observe('hash', () => {
        audioBuffer = audioBuffers.get(host.hash)
      })

      fileInput.addEventListener('file-load', async (event) => {
        const { name, content } = /** @type {FileLoadEvent} */ (event).detail
        host.name = name

        // Do not update host.hash before decoding audio data
        const hash = await computeHash(content)
        if (!audioBuffers.has(hash)) {
          audioBuffers.set(hash, await audioContext.decodeAudioData(content))
        }
        host.hash = hash
      })
    })
  },
})
