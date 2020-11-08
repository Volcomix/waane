import {
  bindAudioTrack,
  unbindAudioTrack,
} from '../audio-tracker/use-audio-tracker.js'
import { defineCustomElement, html } from '../shared/core/element.js'
import { bindAudioOutput } from './use-audio-link.js'
import createAudioNode from './use-audio-node.js'

/**
 * @typedef {import('./node-schedule.js').Schedule} Schedule
 * @typedef {import('../shared/base/select.js').default} Select
 *
 * @typedef {object} Track
 * @property {(timer: number) => void} trigger
 */

export default defineCustomElement('node-track', {
  template: html`
    <w-graph-node>
      <span slot="title">Track</span>
      <w-graph-node-output type="trigger">On</w-graph-node-output>
      <w-select label="Track"></w-select>
    </w-graph-node>
  `,
  shadow: false,
  properties: {
    track: String,
  },
  setup: createAudioNode(({ host, connected, disconnected, useProperty }) => {
    /** @type {Set<Schedule>} */
    const schedules = new Set()

    const track = {
      /**
       * @param {number} time
       */
      trigger(time) {
        schedules.forEach((schedule) => schedule.trigger(time))
      },

      /**
       * @param {Schedule} schedule
       */
      connect(schedule) {
        schedules.add(schedule)
      },

      disconnect() {
        schedules.clear()
      },
    }

    /** @type {Select} */
    let selectField

    connected(() => {
      selectField = host.querySelector('w-select')

      // Must be done first to ensure the select options are populated
      bindAudioTrack(selectField, track)

      bindAudioOutput(host.querySelector('w-graph-node-output'), track)
      useProperty(selectField, 'track')
    })

    disconnected(() => {
      unbindAudioTrack(selectField)
    })
  }),
})
