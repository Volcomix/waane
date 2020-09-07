import { css, html, WaaneElement } from '../waane-element.js'

class Link extends WaaneElement {
  static get styles() {
    return css`
      :host {
        position: absolute;
        display: block;
        min-width: 20px;
        min-height: 20px;
      }

      .container {
        width: 100%;
        height: 100%;
        overflow: visible;
        fill: none;
        stroke-width: 1.5px;
        stroke: rgba(var(--on-background), var(--medium-emphasis));
      }
    `
  }

  static get template() {
    return html`
      <svg class="container">
        <path class="path" />
      </svg>
    `
  }

  static get properties() {
    return { from: String, to: String }
  }

  constructor() {
    super()
    this._path = this.shadowRoot.querySelector('.path')
  }

  update(fromPosition, toPosition) {
    const { width, height } = this._updateBoundingBox(fromPosition, toPosition)
    this._updatePath(fromPosition, toPosition, width, height)
  }

  _updateBoundingBox(fromPosition, toPosition) {
    if (fromPosition && toPosition) {
      const width = Math.abs(toPosition.x - fromPosition.x)
      const height = Math.abs(toPosition.y - fromPosition.y)

      this.style.left = `${Math.min(fromPosition.x, toPosition.x)}px`
      this.style.top = `${Math.min(fromPosition.y, toPosition.y)}px`
      this.style.width = `${width}px`
      this.style.height = `${height}px`

      return { width, height }
    } else {
      this.style.left = null
      this.style.top = null
      this.style.width = null
      this.style.height = null
      return {}
    }
  }

  _updatePath(fromPosition, toPosition, width, height) {
    if (fromPosition && toPosition) {
      const start = {
        x: toPosition.x > fromPosition.x ? 0 : width,
        y: toPosition.y > fromPosition.y ? 0 : height,
      }
      const end = {
        x: toPosition.x > fromPosition.x ? width : 0,
        y: toPosition.y > fromPosition.y ? height : 0,
      }
      const startControlPoint = {
        x: start.x + width * 0.5,
        y: start.y,
      }
      const endControlPoint = {
        x: end.x - width * 0.5,
        y: end.y,
      }
      this._path.setAttribute(
        'd',
        [
          `M ${start.x},${start.y}`,
          `C ${startControlPoint.x},${startControlPoint.y}`,
          `${endControlPoint.x},${endControlPoint.y}`,
          `${end.x},${end.y}`,
        ].join(' '),
      )
    } else {
      this._path.removeAttribute('d')
    }
  }
}

customElements.define('w-link', Link)
