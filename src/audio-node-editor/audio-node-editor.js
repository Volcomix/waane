import { css, defineCustomElement, html } from '../shared/core/element.js'
import { squaredDist } from '../shared/helpers/geometry.js'
import useNodeEditorMousePosition from '../shared/node-editor/use-node-editor-mouse-position.js'
import useAudioLinkType from './use-audio-link-type.js'
import useAudioLink from './use-audio-link.js'
import useGraphNodeMenu from './use-graph-node-menu.js'
import useNodeEditorMenu from './use-node-editor-menu.js'

/**
 * @typedef {import('../shared/node-editor/node-editor.js').default} NodeEditor
 * @typedef {import('../shared/node-editor/graph-node.js').default} GraphNode
 * @typedef {import('../shared/node-editor/graph-link.js').default} GraphLink
 * @typedef {import('../shared/base/menu.js').default} Menu
 * @typedef {import('../shared/base/menu-item.js').default} MenuItem
 */

export default defineCustomElement('audio-node-editor', {
  styles: css`
    w-fab {
      position: absolute;
      left: 8px;
      transform: translateY(-50%);
    }

    w-node-editor {
      height: 100%;
    }

    w-graph-node-output[type='audio'],
    w-graph-node-input[type='audio'] {
      --socket-color: var(--color-additional1);
    }

    w-graph-node-output[type='trigger'],
    w-graph-node-input[type='trigger'] {
      --socket-color: var(--color-additional2);
    }
  `,
  template: html`
    <w-fab>
      <w-icon>add</w-icon>
      Add node
    </w-fab>
    <w-node-editor></w-node-editor>
    <w-menu id="node-editor-menu">
      <w-menu-item value="node-track">Track</w-menu-item>
      <w-menu-item value="node-schedule">Schedule</w-menu-item>
      <w-menu-item value="node-oscillator">Oscillator</w-menu-item>
      <w-menu-item value="node-constant">Constant</w-menu-item>
      <w-menu-item value="node-gain">Gain</w-menu-item>
      <w-menu-item value="node-biquad-filter">Biquad filter</w-menu-item>
      <w-menu-item value="node-audio-destination">
        Audio destination
      </w-menu-item>
    </w-menu>
    <w-menu id="graph-node-menu">
      <w-menu-item id="duplicate">
        <w-icon>content_copy</w-icon>
        <span>Duplicate</span>
      </w-menu-item>
      <hr />
      <w-menu-item id="delete">
        <w-icon>delete</w-icon>
        <span>Delete</span>
      </w-menu-item>
    </w-menu>
  `,
  setup({ host }) {
    const fab = /** @type {HTMLElement} */ (host.shadowRoot.querySelector(
      'w-fab',
    ))
    const nodeEditor = /** @type {NodeEditor} */ (host.shadowRoot.querySelector(
      'w-node-editor',
    ))
    const nodeEditorMenu = /** @type {Menu} */ (host.shadowRoot.querySelector(
      '#node-editor-menu',
    ))
    const graphNodeMenu = /** @type {Menu} */ (host.shadowRoot.querySelector(
      '#graph-node-menu',
    ))
    const graphNodeMenuItemDuplicate = /** @type {MenuItem} */ (graphNodeMenu.querySelector(
      '#duplicate',
    ))
    const graphNodeMenuItemDelete = /** @type {MenuItem} */ (graphNodeMenu.querySelector(
      '#delete',
    ))

    const getNodeEditorMousePosition = useNodeEditorMousePosition(nodeEditor)

    // The order does matter because each one can stop the immediate
    // propagation to the next one
    useGraphNodeMenu(nodeEditor, graphNodeMenu)
    useNodeEditorMenu(nodeEditor, nodeEditorMenu)

    useAudioLinkType(nodeEditor)
    useAudioLink(nodeEditor)

    function cancelMovingGraphNodes() {
      nodeEditor.querySelectorAll('w-graph-node[moving]').forEach((
        /** @type {GraphNode} */ movingGraphNode,
      ) => {
        movingGraphNode.moving = false
      })
    }

    /**
     * @param {Element} graphNode
     */
    function removeGraphNodeOutputLinks(graphNode) {
      graphNode.querySelectorAll('w-graph-node-output').forEach((output) => {
        nodeEditor
          .querySelectorAll(`w-graph-link[from='${output.id}']`)
          .forEach((/** @type {GraphLink} */ graphLink) => {
            nodeEditor.dispatchEvent(
              new CustomEvent('graph-link-disconnect', {
                detail: { from: graphLink.from, to: graphLink.to },
              }),
            )
            graphLink.remove()
          })
      })
    }

    /**
     * @param {Element} graphNode
     */
    function removeGraphNodeInputLinks(graphNode) {
      graphNode.querySelectorAll('w-graph-node-input').forEach((input) => {
        nodeEditor.querySelectorAll(`w-graph-link[to='${input.id}']`).forEach((
          /** @type {GraphLink} */ graphLink,
        ) => {
          nodeEditor.dispatchEvent(
            new CustomEvent('graph-link-disconnect', {
              detail: { from: graphLink.from, to: graphLink.to },
            }),
          )
          graphLink.remove()
        })
      })
    }

    fab.addEventListener('click', () => {
      const { x, y } = fab.getBoundingClientRect()
      nodeEditorMenu.open = true
      nodeEditorMenu.x = x
      nodeEditorMenu.y = y
    })

    nodeEditorMenu.addEventListener('click', (event) => {
      const menuItem = /** @type {MenuItem} */ (event.target)
      if (!menuItem.value) {
        return
      }

      cancelMovingGraphNodes()

      const { x, y } = getNodeEditorMousePosition(event)

      const audioNode = document.createElement(menuItem.value)
      nodeEditor.appendChild(audioNode)

      const graphNode = /** @type {GraphNode} */ (audioNode.querySelector(
        'w-graph-node',
      ))
      graphNode.x = x
      graphNode.y = y
      graphNode.moving = true
    })

    graphNodeMenuItemDuplicate.addEventListener('click', (event) => {
      cancelMovingGraphNodes()

      const nodeEditorMousePosition = getNodeEditorMousePosition(event)

      const offsetX = (event.clientX - graphNodeMenu.x) / nodeEditor.zoom
      const offsetY = (event.clientY - graphNodeMenu.y) / nodeEditor.zoom

      /** @type {GraphNode} */
      let nearestGraphNode = null

      let minSquaredDist = Infinity

      const socketIdsByGraphLink = new WeakMap()

      nodeEditor.querySelectorAll('w-graph-node[selected]').forEach((
        /** @type {GraphNode} */ selectedGraphNode,
      ) => {
        // Unselects the already existing node (the one that was duplicated)
        selectedGraphNode.selected = false

        // Duplicates the audio node
        const duplicatedAudioNode = /** @type {HTMLElement} */ (selectedGraphNode.parentElement.cloneNode())
        nodeEditor.appendChild(duplicatedAudioNode)

        // Sets the duplicated graph node position
        const duplicatedGraphNode = /** @type {GraphNode} */ (duplicatedAudioNode.querySelector(
          'w-graph-node',
        ))
        duplicatedGraphNode.x = selectedGraphNode.x + offsetX
        duplicatedGraphNode.y = selectedGraphNode.y + offsetY
        duplicatedGraphNode.selected = true

        // Finds the nearest graph node which is behind the mouse
        if (!nearestGraphNode) {
          nearestGraphNode = duplicatedGraphNode
        } else if (
          duplicatedGraphNode.x <= nodeEditorMousePosition.x &&
          duplicatedGraphNode.y <= nodeEditorMousePosition.y
        ) {
          const graphNodeSquaredDist = squaredDist(
            duplicatedGraphNode,
            nodeEditorMousePosition,
          )
          if (graphNodeSquaredDist < minSquaredDist) {
            nearestGraphNode = duplicatedGraphNode
            minSquaredDist = graphNodeSquaredDist
          }
        }

        // Duplicates links
        const duplicatedOutputs = duplicatedGraphNode.querySelectorAll(
          'w-graph-node-output',
        )
        selectedGraphNode
          .querySelectorAll('w-graph-node-output')
          .forEach((output, outputIndex) => {
            nodeEditor
              .querySelectorAll(`w-graph-link[from='${output.id}']`)
              .forEach((graphLink) => {
                if (socketIdsByGraphLink.has(graphLink)) {
                  const duplicatedGraphLink = /** @type {GraphLink} */ (document.createElement(
                    'w-graph-link',
                  ))
                  duplicatedGraphLink.from = duplicatedOutputs[outputIndex].id
                  duplicatedGraphLink.to = socketIdsByGraphLink.get(graphLink)
                  nodeEditor.appendChild(duplicatedGraphLink)
                  nodeEditor.dispatchEvent(
                    new CustomEvent('graph-link-connect', {
                      detail: {
                        from: duplicatedGraphLink.from,
                        to: duplicatedGraphLink.to,
                      },
                    }),
                  )
                } else {
                  socketIdsByGraphLink.set(
                    graphLink,
                    duplicatedOutputs[outputIndex].id,
                  )
                }
              })
          })

        const duplicatedInputs = duplicatedGraphNode.querySelectorAll(
          'w-graph-node-input',
        )
        selectedGraphNode
          .querySelectorAll('w-graph-node-input')
          .forEach((input, inputIndex) => {
            nodeEditor
              .querySelectorAll(`w-graph-link[to='${input.id}']`)
              .forEach((graphLink) => {
                if (socketIdsByGraphLink.has(graphLink)) {
                  const duplicatedGraphLink = /** @type {GraphLink} */ (document.createElement(
                    'w-graph-link',
                  ))
                  duplicatedGraphLink.from = socketIdsByGraphLink.get(graphLink)
                  duplicatedGraphLink.to = duplicatedInputs[inputIndex].id
                  nodeEditor.appendChild(duplicatedGraphLink)
                  nodeEditor.dispatchEvent(
                    new CustomEvent('graph-link-connect', {
                      detail: {
                        from: duplicatedGraphLink.from,
                        to: duplicatedGraphLink.to,
                      },
                    }),
                  )
                } else {
                  socketIdsByGraphLink.set(
                    graphLink,
                    duplicatedInputs[inputIndex].id,
                  )
                }
              })
          })
      })

      nearestGraphNode.moving = true
    })

    graphNodeMenuItemDelete.addEventListener('click', () => {
      nodeEditor
        .querySelectorAll('w-graph-node[selected]')
        .forEach((selectedGraphNode) => {
          removeGraphNodeOutputLinks(selectedGraphNode)
          removeGraphNodeInputLinks(selectedGraphNode)
          selectedGraphNode.parentElement.remove()
        })
    })
  },
})
