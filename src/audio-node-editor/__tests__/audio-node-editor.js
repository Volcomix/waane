import { expect, test } from '@jest/globals'
import '../audio-node-editor'

test('has no node by default', () => {
  const audioNodeEditor = document.createElement('audio-node-editor')
  const graphNode = audioNodeEditor.shadowRoot.querySelector('w-graph-node')
  expect(graphNode).toBeNull()
})

test('adds an oscillator node', () => {
  const audioNodeEditor = document.createElement('audio-node-editor')
  const oscillatorMenuItem = /** @type {HTMLElement} */ (Array.from(
    audioNodeEditor.shadowRoot.querySelectorAll('w-menu-item'),
  ).find((menuItem) => menuItem.textContent === 'Oscillator'))
  oscillatorMenuItem.click()
  const graphNode = audioNodeEditor.shadowRoot.querySelector('w-graph-node')
  expect(graphNode.textContent).toBe('Oscillator')
})
