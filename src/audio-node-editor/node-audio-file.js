import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'

/**
 * @typedef {import('../shared/base/file.js').FileLoadEvent} FileLoadEvent
 */

export default defineCustomElement('node-audio-file', {
  template: html`
    <w-graph-node>
      <span slot="title">Audio file</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
      <w-file></w-file>
    </w-graph-node>
  `,
  shadow: false,
  setup({ host, connected }) {
    const audioContext = useAudioContext()

    connected(() => {
      const fileInput = host.querySelector('w-file')

      fileInput.addEventListener('file-load', async (event) => {
        const fileLoadEvent = /** @type {FileLoadEvent} */ (event)
        const audioBuffer = await audioContext.decodeAudioData(fileLoadEvent.detail.content)
        console.log(fileLoadEvent.detail.name, audioBuffer.duration)
      })
    })
  },
})
