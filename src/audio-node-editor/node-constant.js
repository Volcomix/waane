import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioOutput } from './use-audio-link.js'
import createAudioNode from './use-audio-node.js'

const offsetLabel = 'Offset'

export default defineCustomElement('node-constant', {
  template: html`
    <w-graph-node>
      <span slot="title">Constant</span>
      <w-graph-node-output type="audio">Output</w-graph-node-output>
      <w-graph-node-input>
        <w-number-field label="${offsetLabel}"></w-number-field>
      </w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  properties: {
    offset: Number,
  },
  setup: createAudioNode(({ host, connected, disconnected, useAudioParam }) => {
    const audioContext = useAudioContext()
    const constant = audioContext.createConstantSource()

    connected(() => {
      bindAudioOutput(host.querySelector('w-graph-node-output'), constant)
      useAudioParam(
        host.querySelector(`w-number-field[label='${offsetLabel}']`),
        constant,
        'offset',
      )
      constant.start()
    })

    disconnected(() => {
      constant.stop()
    })
  }),
})
