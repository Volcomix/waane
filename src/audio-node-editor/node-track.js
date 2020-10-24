import { defineCustomElement, html } from '../shared/core/element.js'
import useAudioContext from './use-audio-context.js'
import { bindAudioOutput } from './use-audio-link.js'

/**
 * @typedef {import('./node-schedule.js').Schedule} Schedule
 */

export default defineCustomElement('node-track', {
  template: html`
    <w-graph-node>
      <span slot="title">Track</span>
      <w-graph-node-output type="trigger">On</w-graph-node-output>
    </w-graph-node>
  `,
  shadow: false,
  setup({ host, connected, disconnected }) {
    const audioContext = useAudioContext()

    /** @type {Set<Schedule>} */
    const schedules = new Set()

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

    connected(() => {
      bindAudioOutput(host.querySelector('w-graph-node-output'), track)
      scheduleTrigger()
    })

    disconnected(() => {
      window.clearTimeout(timeoutID)
    })
  },
})
