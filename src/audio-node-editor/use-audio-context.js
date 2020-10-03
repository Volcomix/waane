/** @type {AudioContext} */
let audioContext

export default function useAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}
