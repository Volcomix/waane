import { defineCustomElement, html } from '../core/element.js'

const template = html`
  <style>
    :host {
      display: block;
      height: 100%;
    }
  </style>
  <slot></slot>
`

defineCustomElement('w-graph', template)
