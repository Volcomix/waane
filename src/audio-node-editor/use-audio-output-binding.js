/**
 * @param {HTMLElement} host
 */
export default function useAudioOutputBinding(host) {
  /**
   * @param {HTMLElement} element
   * @param {AudioNode} audioNode
   */
  function bindAudioOutput(element, audioNode) {
    element.addEventListener('graph-link-start', () => {
      host.dispatchEvent(
        new CustomEvent('audio-link-source', {
          detail: audioNode,
          bubbles: true,
        }),
      )
    })

    element.addEventListener('graph-link-end', () => {
      host.dispatchEvent(
        new CustomEvent('audio-link-source', {
          detail: audioNode,
          bubbles: true,
        }),
      )
    })
  }
  return bindAudioOutput
}
