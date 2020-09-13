import { html } from '../helpers/template.js'

const template = document.createElement('template')
template.innerHTML = html`
  <w-context-menu>
    <w-graph></w-graph>
    <w-menu>
      <w-menu-item>Oscillator</w-menu-item>
    </w-menu>
  </w-context-menu>
`

class AudioNodeEditor extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.shadowRoot
      .querySelector('w-menu-item')
      .addEventListener('click', () => {
        const oscillatorNode = document.createElement('w-graph-node')
        oscillatorNode.innerHTML = 'Oscillator'
        this.shadowRoot.querySelector('w-graph').appendChild(oscillatorNode)
      })
  }
}

customElements.define('audio-node-editor', AudioNodeEditor)
