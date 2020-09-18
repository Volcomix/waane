import { defineCustomElement, html } from '../core/element.js'

export default defineCustomElement('w-graph', {
  template: html`
    <style>
      :host {
        display: block;
        height: 100%;
      }
    </style>
    <slot></slot>
  `,
})
