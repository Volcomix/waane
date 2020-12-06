import { css, defineCustomElement, html } from '../core/element.js'

export default defineCustomElement('w-file', {
  styles: css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    w-button {
      margin-bottom: 8px;
      color: rgba(var(--color-on-surface) / var(--text-high-emphasis));
    }

    w-icon {
      margin-right: 8px;
      font-size: 18px;
    }
  `,
  template: html`
    <w-button><w-icon>cloud_upload</w-icon>Choose a file</w-button>
    No file selected
  `,
})
