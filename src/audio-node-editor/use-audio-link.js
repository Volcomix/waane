/**
 * @param {HTMLElement} host
 */
export default function useAudioLink(host) {
  /** @type {AudioNode} */
  let audioLinkSource = null

  /** @type {AudioNode} */
  let audioLinkDestination = null

  host.addEventListener('audio-link-source', (
    /** @type {CustomEvent<AudioNode>} */ event,
  ) => {
    audioLinkSource = event.detail
  })

  host.addEventListener('audio-link-destination', (
    /** @type {CustomEvent<AudioNode>} */ event,
  ) => {
    audioLinkDestination = event.detail
  })

  host.addEventListener('graph-link-connect', () => {
    audioLinkSource.connect(audioLinkDestination)
    audioLinkSource = null
    audioLinkDestination = null
  })
}
