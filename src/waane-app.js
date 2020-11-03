import { css, defineCustomElement, html } from './shared/core/element.js'
import elevation from './shared/core/elevation.js'

export default defineCustomElement('waane-app', {
  styles: css`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    header {
      display: flex;
      justify-content: center;
      background-color: rgb(var(--color-surface));
      ${elevation(4)}
    }

    main {
      position: relative;
      flex: 1;
    }
  `,
  template: html`
    <header>
      <w-tab>Tracks</w-tab>
      <w-tab active>Nodes</w-tab>
    </header>
    <main>
      <audio-tracker hidden></audio-tracker>
      <audio-node-editor></audio-node-editor>
    </main>
  `,
  setup({ host }) {
    const [
      tracksTab,
      nodesTab,
    ] = /** @type {NodeListOf<import('./shared/base/tab.js').default>} */ (host.shadowRoot.querySelectorAll(
      'w-tab',
    ))

    const audioTracker = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'audio-tracker',
    ))
    const audioNodeEditor = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'audio-node-editor',
    ))

    host.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })

    tracksTab.addEventListener('click', () => {
      tracksTab.active = true
      nodesTab.active = false
      audioTracker.hidden = false
      audioNodeEditor.hidden = true
    })

    nodesTab.addEventListener('click', () => {
      tracksTab.active = false
      nodesTab.active = true
      audioTracker.hidden = true
      audioNodeEditor.hidden = false
    })
  },
})
