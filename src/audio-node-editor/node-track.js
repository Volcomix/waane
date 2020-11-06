import useAudioTrack from '../audio-tracker/use-audio-track.js'
import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioOutput } from './use-audio-link.js'
import createAudioNode from './use-audio-node.js'

/**
 * @typedef {import('./node-schedule.js').Schedule} Schedule
 * @typedef {import('../shared/base/select.js').default} Select
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
    const audioContext = useAudioContext()

    /** @type {Set<Schedule>} */
    const schedules = new Set()

    const track = {
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

    /** @type {number} */
    let timeoutID

    let nextTriggerTime = audioContext.currentTime

    function scheduleTrigger() {
      while (nextTriggerTime < audioContext.currentTime + 0.1) {
        schedules.forEach((schedule) => schedule.trigger(nextTriggerTime))
        nextTriggerTime += 0.5
      }
      timeoutID = window.setTimeout(scheduleTrigger, 25)
    }

    connected(() => {
      const selectField = /** @type {Select} */ (host.querySelector('w-select'))
      useAudioTrack(selectField)
      bindAudioOutput(host.querySelector('w-graph-node-output'), track)
      useProperty(selectField, 'track')
      scheduleTrigger()
    })

    disconnected(() => {
      window.clearTimeout(timeoutID)
    })
  }),
})
