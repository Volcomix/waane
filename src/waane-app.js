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
      flex: 1;
    }
  `,
  template: html`
    <header>
      <w-tab>Tracks</w-tab>
      <w-tab active>Nodes</w-tab>
    </header>
    <main>
      <audio-node-editor></audio-node-editor>
    </main>
  `,
})
