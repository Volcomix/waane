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
    this.querySelectorAll('w-link').forEach(link => {
      link.update(this._getFromPosition(link), this._getToPosition(link))
    })
  }

  _getFromPosition(link) {
    const from = this.querySelector(`#${link.from}`)
    const fromRect = from.getBoundingClientRect()
    return {
      x: fromRect.x + fromRect.width,
      y: fromRect.y + fromRect.height / 2,
    }
  }

  _getToPosition(link) {
    const to = this.querySelector(`#${link.to}`)
    const toRect = to.getBoundingClientRect()
    return {
      x: toRect.x,
      y: toRect.y + toRect.height / 2,
    }
  }
}

customElements.define('w-node-editor', NodeEditor)
