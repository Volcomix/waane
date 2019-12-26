import { WaaneElement, html } from '../waane-element.js'

class NodeEditor extends WaaneElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <slot></slot>
    `
  }

  constructor() {
    super()
    this._sockets = new Map()
    this._nodesMoveObserver = new MutationObserver(this._onNodesMove.bind(this))
    this.addEventListener('w-node-resize', this._onNodeResize.bind(this))
  }

  async connectedCallback() {
    this._nodesMoveObserver.observe(this, {
      attributeFilter: ['x', 'y'],
      subtree: true,
    })
    await customElements.whenDefined('w-node')
    await customElements.whenDefined('w-link')
    this.drawLinks()
  }

  disconnectedCallback() {
    this._nodesMoveObserver.disconnect()
  }

  get nodes() {
    return this.querySelectorAll('w-node')
  }

  get links() {
    return this.querySelectorAll('w-link')
  }

  drawLinks() {
    const outputs = new Set()
    const inputs = new Set()
    this.nodes.forEach(node => {
      this._findSockets(node, outputs, inputs)
    })
    this._updateLinks(outputs, inputs)
  }

  _onNodesMove(mutations) {
    const outputs = new Set()
    const inputs = new Set()
    mutations.forEach(mutation => {
      if (this._isNodeMutation(mutation)) {
        this._findSockets(mutation.target, outputs, inputs)
      }
    })
    this._updateLinks(outputs, inputs)
  }

  _onNodeResize(event) {
    const outputs = new Set()
    const inputs = new Set()
    this._findSockets(event.target, outputs, inputs)
    this._updateLinks(outputs, inputs)
  }

  _isNodeMutation(mutation) {
    return mutation.target.tagName.toLowerCase() === 'w-node'
  }

  _findSockets(target, outputs, inputs) {
    let sockets = this._sockets.get(target)
    if (sockets) {
      sockets.outputs.forEach(output => outputs.add(output))
      sockets.inputs.forEach(input => inputs.add(input))
    }
    sockets = { outputs: [], inputs: [] }
    target.outputs.forEach(output => {
      sockets.outputs.push(output.id)
      outputs.add(output.id)
    })
    target.inputs.forEach(input => {
      sockets.inputs.push(input.id)
      inputs.add(input.id)
    })
    this._sockets.set(target, sockets)
  }

  _updateLinks(outputs, inputs) {
    const nodeEditorRect = this.getBoundingClientRect()
    this.links.forEach(link => {
      if (outputs.has(link.from) || inputs.has(link.to)) {
        this._updateLink(link, nodeEditorRect)
      }
    })
  }

  _updateLink(link, nodeEditorRect) {
    const fromPosition = this._getFromPosition(link, nodeEditorRect)
    const toPosition = this._getToPosition(link, nodeEditorRect)
    link.update(fromPosition, toPosition)
  }

  _getFromPosition(link, nodeEditorRect) {
    const from = this.querySelector(`w-output#${link.from}`)
    if (!from) return

    const fromRect = from.getBoundingClientRect()
    return {
      x: fromRect.x + fromRect.width - nodeEditorRect.x,
      y: fromRect.y + fromRect.height / 2 - nodeEditorRect.y,
    }
  }

  _getToPosition(link, nodeEditorRect) {
    const to = this.querySelector(`w-input#${link.to}`)
    if (!to) return

    const toRect = to.getBoundingClientRect()
    return {
      x: toRect.x - nodeEditorRect.x,
      y: toRect.y + toRect.height / 2 - nodeEditorRect.y,
    }
  }
}

customElements.define('w-node-editor', NodeEditor)
