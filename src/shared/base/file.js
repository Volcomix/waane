import { css, defineCustomElement, html } from '../core/element.js'

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
      text-align: center;
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
    <span>No file selected</span>
  `,
  setup({ host }) {
    const button = host.shadowRoot.querySelector('w-button')
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
      fileName.textContent = file.name
      button.classList.add('file-selected')
      fileName.classList.add('file-selected')
    })
  },
})
