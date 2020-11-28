import './audio-node-editor/index.js'
import './audio-tracker/index.js'
import './core/index.js'
import './helpers/index.js'
import './shared/base/index.js'
import './shared/core/index.js'
import './shared/helpers/index.js'
import './shared/node-editor/index.js'

window.addEventListener('load', () => {
  const waaneApp = document.createElement('waane-app')
  document.body.appendChild(waaneApp)
})
