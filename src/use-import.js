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
        const outputs = new Map()
        const inputs = new Map()
        content.nodes.forEach((node) => {
          const audioNode = document.createElement(node.name)
          nodeEditor.appendChild(audioNode)
          Object.entries(node.attributes).forEach(
            ([attributeName, attributeValue]) => {
              audioNode.setAttribute(attributeName, attributeValue)
            },
          )
          const graphNode = /** @type {import('./shared/node-editor/graph-node.js').default} */ (audioNode.querySelector(
            'w-graph-node',
          ))
          graphNode.x = node.x
          graphNode.y = node.y
          audioNode
            .querySelectorAll('w-graph-node-output')
            .forEach((output, index) => {
              outputs.set(node.outputs[index], output.id)
            })
          audioNode
            .querySelectorAll('w-graph-node-input')
            .forEach((input, index) => {
              inputs.set(node.inputs[index], input.id)
            })
        })
        content.links.forEach((link) => {
          const graphLink = document.createElement('w-graph-link')
          graphLink.from = outputs.get(link.from)
          graphLink.to = inputs.get(link.to)
          nodeEditor.appendChild(graphLink)
          nodeEditor.dispatchEvent(
            new CustomEvent('graph-link-connect', {
              detail: {
                from: graphLink.from,
                to: graphLink.to,
              },
            }),
          )
        })
      })
      fileReader.readAsText(file)
    })
    input.click()
  })
}
