import { css, defineCustomElement, html } from '../core/element.js'
import useMove from '../core/use-move.js'
import useSelection from '../core/use-selection.js'

export default defineCustomElement('w-node-editor', {
  styles: css`
    :host {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
    }
  `,
  template: html`
    <w-graph>
      <slot></slot>
    </w-graph>
  `,
  setup({ host }) {
    const graph = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-graph',
    ))

    const { getTranslateX, getTranslateY } = setup(host, graph)
    useSelection(host, 'w-graph-node')
    const setMovingElement = useMove(host, 'w-graph-node')
  },
})

/**
 * @param {HTMLElement} host
 * @param {HTMLElement} pannableElement
 */
function setup(host, pannableElement) {
  let translateX = 0
  let translateY = 0

  host.addEventListener('mousemove', (event) => {
    if ((event.buttons & 4) === 0) {
      return
    }
    translateX += event.movementX
    translateY += event.movementY
    pannableElement.style.transform = `translate(${translateX}px, ${translateY}px)`
  })

  return {
    getTranslateX() {
      return translateX
    },
    getTranslateY() {
      return translateY
    },
  }
}
