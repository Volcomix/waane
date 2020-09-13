import { defineCustomElement, html } from '../shared/core/element.js'

const template = html`
  <w-context-menu>
    <w-graph></w-graph>
    <w-menu>
      <w-menu-item>Oscillator</w-menu-item>
    </w-menu>
  </w-context-menu>
`

defineCustomElement('audio-node-editor', template, function ({ host }) {
  const graph = host.shadowRoot.querySelector('w-graph')
  const oscillatorMenuItem = host.shadowRoot.querySelector('w-menu-item')

  oscillatorMenuItem.addEventListener('click', () => {
    const oscillatorNode = document.createElement('w-graph-node')
    oscillatorNode.innerHTML = 'Oscillator'
    graph.appendChild(oscillatorNode)
  })
})
