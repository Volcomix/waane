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

  async connectedCallback() {
    await customElements.whenDefined('w-node')
    await customElements.whenDefined('w-link')
    const nodeEditorRect = this.getBoundingClientRect()
    this.querySelectorAll('w-link').forEach(link => {
      this._updateLink(link, nodeEditorRect)
    })
  }

  _updateLink(link, nodeEditorRect) {
    const fromPosition = this._getFromPosition(link, nodeEditorRect)
    const toPosition = this._getToPosition(link, nodeEditorRect)
    link.update(fromPosition, toPosition)
  }

  _getFromPosition(link, nodeEditorRect) {
    const from = this.querySelector(`#${link.from}`)
    const fromRect = from.getBoundingClientRect()
    return {
      x: fromRect.x + fromRect.width - nodeEditorRect.x,
      y: fromRect.y + fromRect.height / 2 - nodeEditorRect.y,
    }
  }

  _getToPosition(link, nodeEditorRect) {
    const to = this.querySelector(`#${link.to}`)
    const toRect = to.getBoundingClientRect()
    return {
      x: toRect.x - nodeEditorRect.x,
      y: toRect.y + toRect.height / 2 - nodeEditorRect.y,
    }
  }
}

customElements.define('w-node-editor', NodeEditor)
