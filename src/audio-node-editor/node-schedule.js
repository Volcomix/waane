import { defineCustomElement, html } from '../shared/core/element.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'
import createAudioNode from './use-audio-node.js'

/**
 * @typedef {import('../shared/base/number-field.js').default} NumberField
 * @typedef {import('./use-audio-link.js').Source} Source
 *
 * @typedef {object} ScheduleProperties
 * @property {(timer: number) => void} trigger
 *
 * @typedef {Source & ScheduleProperties} Schedule
 */

const targetValueLabel = 'Target value'
const startTimeLabel = 'Start time'
const timeConstantLabel = 'Time constant'

export default defineCustomElement('node-schedule', {
  template: html`
    <w-graph-node>
      <span slot="title">Schedule</span>
      <w-graph-node-output>Envelope</w-graph-node-output>
      <w-number-field label="${targetValueLabel}"></w-number-field>
      <w-number-field label="${startTimeLabel}"></w-number-field>
      <w-number-field label="${timeConstantLabel}"></w-number-field>
      <w-graph-node-input type="trigger">Trigger</w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  properties: {
    targetValue: Number,
    startTime: Number,
    timeConstant: Number,
  },
  setup: createAudioNode(({ host, connected, useProperty }) => {
    /** @type {Set<AudioParam>} */
    const audioParams = new Set()

    /** @type {Schedule} */
    const schedule = {
      trigger(time) {
        audioParams.forEach((audioParam) => {
          audioParam.setTargetAtTime(host.targetValue, time + host.startTime, host.timeConstant)
        })
      },

      /**
       * @param {AudioParam} audioParam
       */
      connect(audioParam) {
        audioParams.add(audioParam)
      },

      disconnect() {
        audioParams.clear()
      },
    }

    connected(() => {
      bindAudioOutput(host.querySelector('w-graph-node-output'), schedule)
      useProperty(host.querySelector(`w-number-field[label='${targetValueLabel}']`), 'targetValue')
      useProperty(host.querySelector(`w-number-field[label='${startTimeLabel}']`), 'startTime')
      useProperty(host.querySelector(`w-number-field[label='${timeConstantLabel}']`), 'timeConstant')
      bindAudioInput(host.querySelector('w-graph-node-input'), schedule)
    })
  }),
})
