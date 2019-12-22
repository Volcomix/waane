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
    return ['from-node', 'from-output', 'to-node', 'to-input']
  }

  constructor() {
    super()
    this._path = this.shadowRoot.querySelector('path')
  }

  update(from, to) {
    const { width, height } = this._updateBoundingBox(from, to)
    this._updatePath(from, to, width, height)
  }

  _updateBoundingBox(from, to) {
    const width = Math.abs(to.x - from.x)
    const height = Math.abs(to.y - from.y)

    this.style.left = `${Math.min(from.x, to.x)}px`
    this.style.top = `${Math.min(from.y, to.y)}px`
    this.style.width = `${width}px`
    this.style.height = `${height}px`

    return { width, height }
  }

  _updatePath(from, to, width, height) {
    const start = {
      x: to.x > from.x ? 0 : width,
      y: to.y > from.y ? 0 : height,
    }
    const end = {
      x: to.x > from.x ? width : 0,
      y: to.y > from.y ? height : 0,
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
