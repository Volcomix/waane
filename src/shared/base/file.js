import { css, defineCustomElement, html } from '../core/element.js'
import typography from '../core/typography.js'

/**
 * @typedef {import('./tooltip.js').default} Tooltip
 *
 * @typedef {object} FileLoadEventDetail
 * @property {string} name
 * @property {ArrayBuffer} content
 *
 * @typedef {CustomEvent<FileLoadEventDetail>} FileLoadEvent
 */

export default defineCustomElement('w-file', {
  styles: css`
    :host {
      width: 208px;
      display: flex;
      flex-direction: column;
    }

    w-button {
      margin-bottom: 8px;
      align-self: center;
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
      transition: color 200ms var(--easing-standard);
    }

    :host([name]) w-button {
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
    }

    w-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      transition: color 200ms var(--easing-standard);
      ${typography('body2')}
    }

    :host([name]) span {
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }
  `,
  template: html`
    <w-button><w-icon>cloud_upload</w-icon>Choose a file</w-button>
    <w-tooltip text="No file selected">
      <span>No file selected</span>
    </w-tooltip>
  `,
  properties: {
    name: String,
  },
  setup({ host, observe }) {
    /** @type {Tooltip} */
    const tooltip = host.shadowRoot.querySelector('w-tooltip')

    const fileName = host.shadowRoot.querySelector('span')

    const input = document.createElement('input')
    input.type = 'file'

    observe('name', () => {
      tooltip.text = host.name
      fileName.textContent = host.name
    })

    host.addEventListener('click', () => {
      input.click()
    })

    input.addEventListener('change', async () => {
      if (input.files.length !== 1) {
        return
      }
      const file = input.files[0]
      host.name = file.name
      const content = await file.arrayBuffer()

      /** @type {FileLoadEvent} */
      const fileLoadEvent = new CustomEvent('file-load', {
        detail: {
          name: file.name,
          content,
        },
      })

      host.dispatchEvent(fileLoadEvent)
    })
  },
})
