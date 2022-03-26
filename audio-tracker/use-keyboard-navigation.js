/**
 * @param {HTMLElement} host
 */
export default function useKeyboardNavigation(host) {
  host.addEventListener('keydown', (event) => {
    if (!['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key)) {
      return
    }
    const audioTracks = [...host.querySelectorAll('audio-track')]
    const audioTrackIndex = audioTracks.findIndex((audioTrack) => audioTrack.matches(':focus-within'))
    if (audioTrackIndex === -1) {
      return
    }
    const audioTrack = audioTracks[audioTrackIndex]
    const trackEffects = [...audioTrack.querySelectorAll('track-effect')]
    const trackEffectIndex = trackEffects.findIndex((trackEffect) => trackEffect.matches(':focus-within'))
    if (trackEffectIndex === -1) {
      return
    }
    /** @type {Element} */
    let trackEffect
    switch (event.key) {
      case 'ArrowUp':
        trackEffect = trackEffects[Math.max(0, trackEffectIndex - 1)]
        break
      case 'ArrowRight':
        const audioTrackRight = audioTracks[Math.min(audioTracks.length - 1, audioTrackIndex + 1)]
        trackEffect = audioTrackRight.querySelectorAll('track-effect')[trackEffectIndex]
        break
      case 'ArrowDown':
        trackEffect = trackEffects[Math.min(trackEffects.length - 1, trackEffectIndex + 1)]
        break
      case 'ArrowLeft':
        const audioTrackLeft = audioTracks[Math.max(0, audioTrackIndex - 1)]
        trackEffect = audioTrackLeft.querySelectorAll('track-effect')[trackEffectIndex]
        break
    }
    /** @type {HTMLElement} */
    const nextTrackEffect = trackEffect.shadowRoot.querySelector('[tabindex]')

    nextTrackEffect.focus()
  })
}
