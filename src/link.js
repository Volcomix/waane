import { WaaneElement, html } from './waane-element.js'

class Link extends WaaneElement {
  static get template() {
    return html`
      <style>
        :host {
          position: absolute;
          display: block;
        }

        svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          fill: none;
          stroke: black;
        }
      </style>

      <svg>
        <path />
      </svg>
    `
  }

  static get observedAttributes() {
    return ['from', 'to']
  }

  constructor() {
    super()
    this._path = this.shadowRoot.querySelector('path')
  }

  update(fromPosition, toPosition) {
    const { width, height } = this._updateBoundingBox(fromPosition, toPosition)
    this._updatePath(fromPosition, toPosition, width, height)
  }

  _updateBoundingBox(fromPosition, toPosition) {
    const width = Math.abs(toPosition.x - fromPosition.x)
    const height = Math.abs(toPosition.y - fromPosition.y)

    this.style.left = `${Math.min(fromPosition.x, toPosition.x)}px`
    this.style.top = `${Math.min(fromPosition.y, toPosition.y)}px`
    this.style.width = `${width}px`
    this.style.height = `${height}px`

    return { width, height }
  }

  _updatePath(fromPosition, toPosition, width, height) {
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
      `M ${start.x}, ${start.y}
       C ${startControlPoint.x}, ${startControlPoint.y}
         ${endControlPoint.x}, ${endControlPoint.y}
         ${end.x}, ${end.y}`,
    )
  }
}

customElements.define('w-link', Link)
