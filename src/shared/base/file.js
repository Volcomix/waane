import { css, defineCustomElement, html } from '../core/element.js'

/**
 * @typedef {import('./tooltip.js').default} Tooltip
 */

export default defineCustomElement('w-file', {
  styles: css`
    :host {
      width: 256px;
      display: flex;
      flex-direction: column;
    }

    w-button {
      margin-bottom: 8px;
      align-self: stretch;
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
      transition: color 200ms var(--easing-standard);
    }

    w-button.file-selected {
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
    }

    w-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgba(var(--color-on-surface) / var(--text-medium-emphasis));
      transition: color 200ms var(--easing-standard);
    }

    span.file-selected {
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }
  `,
  template: html`
    <w-button><w-icon>cloud_upload</w-icon>Choose a file</w-button>
    <w-tooltip text="No file selected">
      <span>No file selected</span>
    </w-tooltip>
  `,
  setup({ host }) {
    const button = host.shadowRoot.querySelector('w-button')

    /** @type {Tooltip} */
    const tooltip = host.shadowRoot.querySelector('w-tooltip')

    const fileName = host.shadowRoot.querySelector('span')

    const input = document.createElement('input')
    input.type = 'file'

    host.addEventListener('click', () => {
      input.click()
    })

    input.addEventListener('change', async () => {
      if (input.files.length !== 1) {
        return
      }
      const file = input.files[0]
      tooltip.text = file.name
      fileName.textContent = file.name
      fileName.classList.add('file-selected')
      button.classList.add('file-selected')
    })
  },
})
