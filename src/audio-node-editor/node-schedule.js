import { defineCustomElement, html } from '../shared/core/element.js'
import { bindAudioInput, bindAudioOutput } from './use-audio-link.js'

/**
 * @typedef {import('../shared/base/number-field.js').default} NumberField
 * @typedef {import('./use-audio-link.js').Source} Source
 *
 * @typedef {object} ScheduleProperties
 * @property {(timer: number) => void} trigger
 *
 * @typedef {Source & ScheduleProperties} Schedule
 */

export default defineCustomElement('node-schedule', {
  template: html`
    <w-graph-node>
      <span slot="title">Schedule</span>
      <w-graph-node-output>Envelope</w-graph-node-output>
      <w-number-field label="Target value"></w-number-field>
      <w-number-field label="Start time"></w-number-field>
      <w-number-field label="Time constant"></w-number-field>
      <w-graph-node-input type="trigger">Trigger</w-graph-node-input>
    </w-graph-node>
  `,
  shadow: false,
  properties: {
    targetValue: Number,
    startTime: Number,
    timeConstant: Number,
  },
  setup({ host, connected, observe }) {
    /** @type {Set<AudioParam>} */
    const audioParams = new Set()

    /** @type {Schedule} */
    const schedule = {
      trigger(time) {
        audioParams.forEach((audioParam) =>
          audioParam.setTargetAtTime(
            host.targetValue,
            time + host.startTime,
            host.timeConstant,
          ),
        )
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
      const targetValueField = /** @type {NumberField} */ (host.querySelector(
        `w-number-field[label='Target value']`,
      ))
      const startTimeField = /** @type {NumberField} */ (host.querySelector(
        `w-number-field[label='Start time']`,
      ))
      const timeConstantField = /** @type {NumberField} */ (host.querySelector(
        `w-number-field[label='Time constant']`,
      ))

      targetValueField.value = host.targetValue
      startTimeField.value = host.startTime
      timeConstantField.value = host.timeConstant

      bindAudioOutput(host.querySelector('w-graph-node-output'), schedule)
      bindAudioInput(host.querySelector('w-graph-node-input'), schedule)

      observe('targetValue', () => {
        targetValueField.value = host.targetValue
      })

      observe('startTime', () => {
        startTimeField.value = host.startTime
      })

      observe('timeConstant', () => {
        timeConstantField.value = host.timeConstant
      })

      targetValueField.addEventListener('input', () => {
        host.targetValue = targetValueField.value
      })

      startTimeField.addEventListener('input', () => {
        host.startTime = startTimeField.value
      })

      timeConstantField.addEventListener('input', () => {
        host.timeConstant = timeConstantField.value
      })
    })
  },
})
