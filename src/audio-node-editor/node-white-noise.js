import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioOutput } from './use-audio-link.js'

export default defineCustomElement('node-white-noise', {
  template: html`
    <w-graph-node>
      <span slot="title">White noise</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
    </w-graph-node>
  `,
  shadow: false,
  setup({ host, connected, disconnected }) {
    const audioContext = useAudioContext()
    const bufferSize = audioContext.sampleRate * 2
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const noise = audioContext.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    connected(() => {
      bindAudioOutput(host.querySelector('w-graph-node-output'), noise)
      noise.start()
    })

    disconnected(() => {
      noise.stop()
    })
  },
})
