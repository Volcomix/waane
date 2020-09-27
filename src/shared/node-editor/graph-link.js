import { css, defineCustomElement, html } from '../core/element.js'

export default defineCustomElement('w-graph-link', {
  styles: css`
    :host {
      position: absolute;
      display: block;
      min-width: 20px;
      min-height: 20px;
      pointer-events: none;
    }

    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
      fill: none;
      stroke-width: 1.5px;
      /* TODO high-emphasis when drawing, medium-emphasis when added */
      stroke: rgba(var(--color-on-background) / var(--text-medium-emphasis));
    }
  `,
  template: html`
    <svg>
      <path></path>
    </svg>
  `,
  properties: {
    fromX: Number,
    fromY: Number,
    toX: Number,
    toY: Number,
  },
  setup({ host, connected, disconnected }) {
    const path = host.shadowRoot.querySelector('path')

    const observer = new MutationObserver(() => {
      const { fromX, toX, fromY, toY } = host
      const width = Math.abs(toX - fromX)
      const height = Math.abs(toY - fromY)

      host.style.left = `${Math.min(fromX, toX)}px`
      host.style.top = `${Math.min(fromY, toY)}px`
      host.style.width = `${width}px`
      host.style.height = `${height}px`

      const startPoint = {
        x: toX > fromX ? 0 : width,
        y: toY > fromY ? 0 : height,
      }
      const endPoint = {
        x: toX > fromX ? width : 0,
        y: toY > fromY ? height : 0,
      }
      const startControlPoint = {
        x: startPoint.x + width / 2,
        y: startPoint.y,
      }
      const endControlPoint = {
        x: endPoint.x - width / 2,
        y: endPoint.y,
      }
      path.setAttribute(
        'd',
        [
          `M ${startPoint.x},${startPoint.y}`,
          `C ${startControlPoint.x},${startControlPoint.y}`,
          `${endControlPoint.x},${endControlPoint.y}`,
          `${endPoint.x},${endPoint.y}`,
        ].join(' '),
      )
    })

    connected(() => {
      observer.observe(host, {
        attributeFilter: ['from-x', 'from-y', 'to-x', 'to-y'],
      })
    })

    disconnected(() => {
      observer.disconnect()
    })
  },
})
