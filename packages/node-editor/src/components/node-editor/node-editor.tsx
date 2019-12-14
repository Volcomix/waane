import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'w-node-editor',
  styleUrl: 'node-editor.css',
})
export class NodeEditor {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    )
  }
}
