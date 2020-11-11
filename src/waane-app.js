import useAudioTracker from './audio-tracker/use-audio-tracker.js'
import { css, defineCustomElement, html } from './shared/core/element.js'
import elevation from './shared/core/elevation.js'
import useExport from './use-export.js'
import useImport from './use-import.js'

/**
 * @typedef {import('./shared/base/tab.js').default} Tab
 * @typedef {import('./button-play-pause.js').default} ButtonPlayPause
 * @typedef {import('./shared/base/menu.js').default} Menu
 * @typedef {import('./audio-tracker/audio-tracker.js').default} AudioTracker
 * @typedef {import('./audio-node-editor/audio-node-editor.js').default} AudioNodeEditor
 */

export default defineCustomElement('waane-app', {
  styles: css`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    header {
      position: relative;
      display: flex;
      justify-content: center;
      background-color: rgb(var(--color-surface));
      ${elevation(4)}
    }

    .actions {
      position: absolute;
      top: 0;
      right: 4px;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .actions > *:not(w-menu) {
      margin: 0 6px;
    }

    w-menu {
      position: absolute;
      top: 100%;
      right: 0;
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
      <div class="actions">
        <button-play-pause></button-play-pause>
        <w-button>
          <w-icon>more_vert</w-icon>
        </w-button>
        <w-menu>
          <w-menu-item id="import">
            <w-icon>publish</w-icon>
            <span>Import</span>
          </w-menu-item>
          <w-menu-item id="export">
            <w-icon>get_app</w-icon>
            <span>Export</span>
          </w-menu-item>
        </w-menu>
      </div>
    </header>
    <main>
      <audio-tracker hidden></audio-tracker>
      <audio-node-editor active></audio-node-editor>
    </main>
  `,
  setup({ host }) {
    const [tracksTab, nodesTab] = /** @type {NodeListOf<Tab>} */ (host.shadowRoot.querySelectorAll('w-tab'))

    const buttonPlayPause = /** @type {ButtonPlayPause} */ (host.shadowRoot.querySelector('button-play-pause'))

    /** @type {HTMLElement} */
    const buttonMore = host.shadowRoot.querySelector('w-button')

    /** @type {Menu} */
    const menu = host.shadowRoot.querySelector('w-menu')

    /** @type {HTMLElement} */
    const importMenuItem = host.shadowRoot.querySelector('#import')

    /** @type {HTMLElement} */
    const exportMenuItem = host.shadowRoot.querySelector('#export')

    const audioTracker = /** @type {AudioTracker} */ (host.shadowRoot.querySelector('audio-tracker'))
    const audioNodeEditor = /** @type {AudioNodeEditor} */ (host.shadowRoot.querySelector('audio-node-editor'))

    const { startAudioTracker, stopAudioTracker, isAudioTrackerStarted } = useAudioTracker()
    useImport(importMenuItem, audioTracker, audioNodeEditor)
    useExport(exportMenuItem, audioTracker, audioNodeEditor)

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

    buttonPlayPause.addEventListener('click', () => {
      if (isAudioTrackerStarted()) {
        stopAudioTracker()
        buttonPlayPause.active = false
      } else {
        startAudioTracker()
        buttonPlayPause.active = true
      }
    })

    buttonMore.addEventListener('click', () => {
      menu.open = true
    })
  },
})
