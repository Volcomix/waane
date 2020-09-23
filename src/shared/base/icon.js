import { css, defineCustomElement } from '../core/element.js'
import icon from '../core/icon.js'

export default defineCustomElement('w-icon', {
  styles: css`
    :host {
      ${icon}
    }
  `,
})
