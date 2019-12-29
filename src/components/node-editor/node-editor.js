import { WaaneElement, html } from '../waane-element.js'

class NodeEditor extends WaaneElement {
  static get template() {
    return html`
      <style>
        :host {
          position: relative;
          display: block;
        }
      </style>

      <slot></slot>
    `
  }

  constructor() {
    super()
    this._sockets = new Map()
    this._childListObserver = new MutationObserver(
      this._onChildListChange.bind(this),
    )
    this._nodesPositionObserver = new MutationObserver(
      this._onNodesPositionChange.bind(this),
    )
    this._linksSocketObserver = new MutationObserver(
      this._onLinksSocketChange.bind(this),
    )
    this.addEventListener('w-node-resize', this._onNodeResize.bind(this))
  }

  async connectedCallback() {
    this._childListObserver.observe(this, {
      childList: true,
      subtree: true,
    })
    this._nodesPositionObserver.observe(this, {
      attributeFilter: ['x', 'y'],
      subtree: true,
    })
    this._linksSocketObserver.observe(this, {
      attributeFilter: ['from', 'to'],
      subtree: true,
    })
    await customElements.whenDefined('w-node')
    await customElements.whenDefined('w-link')
    this.drawLinks()
  }

  disconnectedCallback() {
    this._childListObserver.disconnect()
    this._nodesPositionObserver.disconnect()
    this._linksSocketObserver.disconnect()
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
      this._findUpdatedSockets(node, outputs, inputs)
    })
    this._updateLinks(outputs, inputs)
  }

  _onChildListChange(mutations) {
    const outputs = new Set()
    const inputs = new Set()
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(child => {
        if (this._isNode(child)) {
          this._findUpdatedSockets(child, outputs, inputs)
        }
        if (this._isLink(child)) {
          this._findLinkedSockets(child, outputs, inputs)
        }
      })
      mutation.removedNodes.forEach(child => {
        if (this._isNode(child)) {
          this._findRemovedSockets(child, outputs, inputs)
        }
      })
    })
    this._updateLinks(outputs, inputs)
  }

  _onNodesPositionChange(mutations) {
    const outputs = new Set()
    const inputs = new Set()
    mutations.forEach(mutation => {
      if (this._isNode(mutation.target)) {
        this._findUpdatedSockets(mutation.target, outputs, inputs)
      }
    })
    this._updateLinks(outputs, inputs)
  }

  _onLinksSocketChange(mutations) {
    const outputs = new Set()
    const inputs = new Set()
    mutations.forEach(mutation => {
      if (this._isLink(mutation.target)) {
        this._findLinkedSockets(mutation.target, outputs, inputs)
      }
    })
    this._updateLinks(outputs, inputs)
  }

  _onNodeResize(event) {
    const outputs = new Set()
    const inputs = new Set()
    this._findUpdatedSockets(event.target, outputs, inputs)
    this._updateLinks(outputs, inputs)
  }

  _isNode(target) {
    return target.nodeName.toLowerCase() === 'w-node'
  }

  _isLink(target) {
    return target.nodeName.toLowerCase() === 'w-link'
  }

  _findUpdatedSockets(target, outputs, inputs) {
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

  _findRemovedSockets(target, outputs, inputs) {
    target.outputs.forEach(output => outputs.add(output.id))
    target.inputs.forEach(input => inputs.add(input.id))
    this._sockets.delete(target)
  }

  _findLinkedSockets(link, outputs, inputs) {
    outputs.add(link.from)
    inputs.add(link.to)
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
