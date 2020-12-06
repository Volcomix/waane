import useAudioTracker from '../audio-tracker/use-audio-tracker.js'
import exportFile from '../helpers/export-file.js'
import { clearAll } from '../helpers/file-helper.js'
import importFile from '../helpers/import-file.js'
import { css, defineCustomElement, html } from '../shared/core/element.js'
import elevation from '../shared/core/elevation.js'

/**
 * @typedef {import('../shared/base/tab.js').default} Tab
 * @typedef {import('../shared/base/menu.js').default} Menu
 * @typedef {import('./button-play-pause.js').default} ButtonPlayPause
 * @typedef {import('../audio-tracker/audio-tracker.js').default} AudioTracker
 * @typedef {import('../audio-node-editor/audio-node-editor.js').default} AudioNodeEditor
 * @typedef {import('../helpers/import-file.js').FileContent} FileContent
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
        <w-icon-button>
          <w-icon>more_vert</w-icon>
        </w-icon-button>
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
    const buttonMore = host.shadowRoot.querySelector('w-icon-button')

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

    const { startAudioTracker, stopAudioTracker, isAudioTrackerStarted } = useAudioTracker(audioTracker)

    function play() {
      startAudioTracker()
      buttonPlayPause.active = true
    }

    function pause() {
      stopAudioTracker()
      buttonPlayPause.active = false
    }

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
        pause()
      } else {
        play()
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
      pause()
      clearAll(audioTracker, audioNodeEditor)
    })

    menuItemOpen.addEventListener('click', () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.addEventListener('change', async () => {
        if (input.files.length !== 1) {
          return
        }
        pause()
        const file = input.files[0]
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          /** @type {FileContent} */
          const content = JSON.parse(/** @type {string} */ (fileReader.result))

          importFile(content, audioTracker, audioNodeEditor)
        })
        fileReader.readAsText(file)
      })
      input.click()
    })

    menuItemExport.addEventListener('click', () => {
      const content = exportFile(audioTracker, audioNodeEditor)

      const blob = new Blob([JSON.stringify(content, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'waane-export.json'
      link.click()
      URL.revokeObjectURL(url)
    })
  },
})
