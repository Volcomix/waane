import { css, defineCustomElement, html } from '../core/element.js'

/** @typedef {import('./graph-node.js').default} GraphNode */

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
      stroke: rgba(var(--color-on-background) / var(--text-disabled));
      transition: stroke 150ms var(--easing-standard);
    }

    :host([linking]) {
      z-index: 8;
    }

    :host([linking]) svg {
      stroke: rgba(var(--color-on-background) / var(--text-high-emphasis));
    }
  `,
  template: html`
    <svg>
      <path></path>
    </svg>
  `,
  properties: {
    from: String,
    fromX: Number,
    fromY: Number,
    to: String,
    toX: Number,
    toY: Number,
    linking: Boolean,
  },
  setup({ host, connected, disconnected, observe }) {
    const path = host.shadowRoot.querySelector('path')

    function getFromPosition() {
      const { from, fromX, fromY } = host
      if (!from) {
        return { fromX, fromY }
      }
      const root = /** @type {Document | ShadowRoot} */ (host.getRootNode())
      const output = /** @type {HTMLElement} */ (root.querySelector(
        `w-graph-node-output#${from}`,
      ))
      const graphNode = /** @type {GraphNode} */ (output.closest(
        'w-graph-node',
      ))
      return {
        fromX: graphNode.x + graphNode.offsetWidth,
        fromY: graphNode.y + output.offsetTop + output.offsetHeight / 2,
      }
    }

    function getToPosition() {
      const { to, toX, toY } = host
      if (!to) {
        return { toX, toY }
      }
      const root = /** @type {Document | ShadowRoot} */ (host.getRootNode())
      const output = /** @type {HTMLElement} */ (root.querySelector(
        `w-graph-node-input#${to}`,
      ))
      const graphNode = /** @type {GraphNode} */ (output.closest(
        'w-graph-node',
      ))
      return {
        toX: graphNode.x,
        toY: graphNode.y + output.offsetTop + output.offsetHeight / 2,
      }
    }

    function updatePath() {
      const { fromX, fromY } = getFromPosition()
      const { toX, toY } = getToPosition()

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
    }

    const observer = new MutationObserver(updatePath)

    function updateObserver() {
      const { from, to } = host
      const root = /** @type {Document | ShadowRoot} */ (host.getRootNode())

      const output = /** @type {HTMLElement} */ (from &&
        root.querySelector(`w-graph-node-output#${host.from}`))

      const input = /** @type {HTMLElement} */ (to &&
        root.querySelector(`w-graph-node-input#${host.to}`))

      observer.disconnect()

      observer.observe(host, {
        attributeFilter: ['from', 'from-x', 'from-y', 'to', 'to-x', 'to-y'],
      })
      if (output) {
        observer.observe(output.closest('w-graph-node'), {
          attributeFilter: ['x', 'y'],
        })
      }
      if (input) {
        observer.observe(input.closest('w-graph-node'), {
          attributeFilter: ['x', 'y'],
        })
      }
    }

    connected(() => {
      updateObserver()

      // When creating a new link, ensures that the path is not rendered
      // before having from-x and from-y values
      if (host.from && host.to) {
        updatePath()
      }
    })

    disconnected(() => {
      observer.disconnect()
    })

    observe('from', updateObserver)

    observe('to', updateObserver)
  },
})
