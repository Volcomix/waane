import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'w-node',
  styleUrl: 'node.css',
})
export class Node {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    )
  }
}
