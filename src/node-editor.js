import { WaaneElement, html } from './waane-element.js'

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
    this._updateLinks()
  }

  disconnectedCallback() {
    this._nodesMoveObserver.disconnect()
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
    target.querySelectorAll('w-output').forEach(output => {
      outputs.add(output.id)
    })
    target.querySelectorAll('w-input').forEach(input => {
      inputs.add(input.id)
    })
  }

  _updateLinks(outputs, inputs) {
    const nodeEditorRect = this.getBoundingClientRect()
    this.querySelectorAll('w-link').forEach(link => {
      if (!outputs || outputs.has(link.from) || inputs.has(link.to)) {
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
    const from = this.querySelector(`#${link.from}`)
    if (!from) {
      return
    }
    const fromRect = from.getBoundingClientRect()
    return {
      x: fromRect.x + fromRect.width - nodeEditorRect.x,
      y: fromRect.y + fromRect.height / 2 - nodeEditorRect.y,
    }
  }

  _getToPosition(link, nodeEditorRect) {
    const to = this.querySelector(`#${link.to}`)
    if (!to) {
      return
    }
    const toRect = to.getBoundingClientRect()
    return {
      x: toRect.x - nodeEditorRect.x,
      y: toRect.y + toRect.height / 2 - nodeEditorRect.y,
    }
  }
}

customElements.define('w-node-editor', NodeEditor)
