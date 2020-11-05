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
      <audio-node-editor active></audio-node-editor>
    </main>
  `,
  setup({ host }) {
    const [
      tracksTab,
      nodesTab,
    ] = /** @type {NodeListOf<import('./shared/base/tab.js').default>} */ (host.shadowRoot.querySelectorAll(
      'w-tab',
    ))

    const audioTracker = /** @type {import('./audio-tracker/audio-tracker.js').default} */ (host.shadowRoot.querySelector(
      'audio-tracker',
    ))
    const audioNodeEditor = /** @type {import('./audio-node-editor/audio-node-editor.js').default} */ (host.shadowRoot.querySelector(
      'audio-node-editor',
    ))

    host.addEventListener('contextmenu', (event) => {
      event.preventDefault()
    })

    tracksTab.addEventListener('click', () => {
      nodesTab.active = false
      audioTracker.hidden = false
      audioNodeEditor.active = false
      setTimeout(() => {
        tracksTab.active = true
        audioTracker.active = true
        audioNodeEditor.hidden = true
      }, 150)
    })

    nodesTab.addEventListener('click', () => {
      tracksTab.active = false
      audioTracker.active = false
      audioNodeEditor.hidden = false
      setTimeout(() => {
        nodesTab.active = true
        audioTracker.hidden = true
        audioNodeEditor.active = true
      }, 150)
    })
  },
})
