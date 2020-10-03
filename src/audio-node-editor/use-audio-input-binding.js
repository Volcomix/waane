/**
 * @param {HTMLElement} host
 */
export default function useAudioInputBinding(host) {
  /**
   * @param {HTMLElement} element
   * @param {AudioNode} audioNode
   */
  function bindAudioInput(element, audioNode) {
    element.addEventListener('graph-link-start', () => {
      host.dispatchEvent(
        new CustomEvent('audio-link-destination', {
          detail: audioNode,
          bubbles: true,
        }),
      )
    })

    element.addEventListener('graph-link-end', () => {
      host.dispatchEvent(
        new CustomEvent('audio-link-destination', {
          detail: audioNode,
          bubbles: true,
        }),
      )
    })
  }
  return bindAudioInput
}
