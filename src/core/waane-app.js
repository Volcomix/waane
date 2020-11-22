import useAudioTracker from '../audio-tracker/use-audio-tracker.js'
import openFile, { clearAll } from '../helpers/open-file.js'
import useExport from '../helpers/use-export.js'
import { css, defineCustomElement, html } from '../shared/core/element.js'
import elevation from '../shared/core/elevation.js'

/**
 * @typedef {import('../shared/base/tab.js').default} Tab
 * @typedef {import('../shared/base/menu.js').default} Menu
 * @typedef {import('./button-play-pause.js').default} ButtonPlayPause
 * @typedef {import('../audio-tracker/audio-tracker.js').default} AudioTracker
 * @typedef {import('../audio-node-editor/audio-node-editor.js').default} AudioNodeEditor
 * @typedef {import('../helpers/open-file.js').ImportContent} ImportContent
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
          <w-menu-item id="new">
            <w-icon>create_new_folder</w-icon>
            <span>New</span>
          </w-menu-item>
          <w-menu-item id="open">
            <w-icon>folder_open</w-icon>
            <span>Open</span>
          </w-menu-item>
          <hr />
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
    const menuItemNew = host.shadowRoot.querySelector('#new')

    /** @type {HTMLElement} */
    const menuItemOpen = host.shadowRoot.querySelector('#open')

    /** @type {HTMLElement} */
    const menuItemExport = host.shadowRoot.querySelector('#export')

    const audioTracker = /** @type {AudioTracker} */ (host.shadowRoot.querySelector('audio-tracker'))
    const audioNodeEditor = /** @type {AudioNodeEditor} */ (host.shadowRoot.querySelector('audio-node-editor'))

    /** @type {boolean} */
    let isMenuOpenOnMouseDown

    const { startAudioTracker, stopAudioTracker, isAudioTrackerStarted } = useAudioTracker()
    useExport(menuItemExport, audioTracker, audioNodeEditor)

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

    buttonMore.addEventListener('mousedown', () => {
      isMenuOpenOnMouseDown = menu.open
    })

    buttonMore.addEventListener('click', () => {
      if (!isMenuOpenOnMouseDown) {
        menu.open = true
      }
    })

    menuItemNew.addEventListener('click', () => {
      clearAll(audioTracker, audioNodeEditor)
    })

    menuItemOpen.addEventListener('click', () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.addEventListener('change', async () => {
        if (input.files.length !== 1) {
          return
        }
        const file = input.files[0]
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          /** @type {ImportContent} */
          const content = JSON.parse(/** @type {string} */ (fileReader.result))

          openFile(content, audioTracker, audioNodeEditor)
        })
        fileReader.readAsText(file)
      })
      input.click()
    })
  },
})
