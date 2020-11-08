/**
 * TODO Finish this WIP
 * @param {HTMLElement} button
 * @param {HTMLElement} audioTracker
 * @param {HTMLElement} audioNodeEditor
 */
export default function useImport(button, audioTracker, audioNodeEditor) {
  button.addEventListener('click', () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.addEventListener('change', async () => {
      if (input.files.length !== 1) {
        return
      }
      const file = input.files[0]
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        const content = JSON.parse(/** @type {string} */ (fileReader.result))
        audioNodeEditor.shadowRoot
          .querySelectorAll('w-graph-node')
          .forEach((graphNode) => graphNode.parentElement.remove())
        audioNodeEditor.shadowRoot
          .querySelectorAll('w-graph-link')
          .forEach((graphLink) => graphLink.remove())
        audioTracker.shadowRoot
          .querySelectorAll('audio-track')
          .forEach((audioTrack) => audioTrack.remove())
        content.tracks.forEach((track) => {
          const audioTrack = document.createElement('audio-track')
          audioTrack.label = track.label
          for (let i = 0; i < 16; i++) {
            const trackEffect = /** @type {import('./audio-tracker/track-effect.js').default} */ (document.createElement(
              'track-effect',
            ))
            trackEffect.beat = i % 4 === 0
            if (i in track.effects) {
              trackEffect.value = track.effects[i]
            }
            audioTrack.appendChild(trackEffect)
          }
          audioTracker.shadowRoot.querySelector('div').appendChild(audioTrack)
        })
        const nodeEditor = audioNodeEditor.shadowRoot.querySelector(
          'w-node-editor',
        )
        Object.entries(content.nodeEditor).forEach(
          ([attributeName, attributeValue]) => {
            nodeEditor.setAttribute(attributeName, attributeValue)
          },
        )
        content.nodes.forEach((node) => {
          const audioNode = document.createElement(node.name)
          Object.entries(node.attributes).forEach(
            ([attributeName, attributeValue]) => {
              audioNode.setAttribute(attributeName, attributeValue)
            },
          )
          nodeEditor.appendChild(audioNode)
          const graphNode = /** @type {import('./shared/node-editor/graph-node.js').default} */ (audioNode.querySelector(
            'w-graph-node',
          ))
          graphNode.x = node.x
          graphNode.y = node.y
        })
      })
      fileReader.readAsText(file)
    })
    input.click()
  })
}
