import { html } from '../shared/core/element.js'

const template = document.createElement('template')
template.innerHTML = html`
  <w-context-menu>
    <w-graph></w-graph>
    <w-menu>
      <w-menu-item>Oscillator</w-menu-item>
    </w-menu>
  </w-context-menu>
`

export default class AudioNodeEditor extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._graph = this.shadowRoot.querySelector('w-graph')

    const oscillatorMenuItem = /** @type {HTMLElement} */ (this.shadowRoot.querySelector(
      'w-menu-item',
    ))
    oscillatorMenuItem.addEventListener(
      'click',
      this._onOscillatorMenuItemClick,
    )
  }

  /**
   * @param {MouseEvent} event
   */
  _onOscillatorMenuItemClick = (event) => {
    const oscillatorNode = /** @type {import('../shared/node-editor/graph-node.js').default} */ (document.createElement(
      'w-graph-node',
    ))
    oscillatorNode.innerHTML = 'Oscillator'
    oscillatorNode.x = event.pageX
    oscillatorNode.y = event.pageY
    this._graph.appendChild(oscillatorNode)
  }
}

customElements.define('audio-node-editor', AudioNodeEditor)
