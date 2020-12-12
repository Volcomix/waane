import { expect, test } from '@jest/globals'
import { defaultLines, defaultLinesPerBeat, defaultTempo } from '../../audio-tracker/use-audio-tracker'
import exportFile from '../../helpers/export-file'
import { clearAll } from '../../helpers/file-helper'
import importFile from '../../helpers/import-file'
import { defaultPanX, defaultPanY, defaultZoom } from '../../shared/node-editor/use-mouse-navigation'
import fileContent01 from '../../testing/bass-drum-0.1'
import fileContent02 from '../../testing/bass-drum-0.2'
import fileContent03 from '../../testing/bass-drum-0.3'
import fileContent from '../../testing/drum-kit'
import { setup } from '../../testing/helpers'

/**
 * @typedef {import('../../helpers/file-helper.js').FileContent} FileContent
 */

test('migrates from 0.1 to 0.3', () => {
  const { audioTracker, audioNodeEditor } = setup('Tracks')
  importFile(fileContent01, audioTracker, audioNodeEditor)
  expect(exportFile(audioTracker, audioNodeEditor)).toEqual(fileContent03)
})

test('migrates from 0.2 to 0.3', () => {
  const { audioTracker, audioNodeEditor } = setup('Tracks')
  importFile(fileContent02, audioTracker, audioNodeEditor)
  expect(exportFile(audioTracker, audioNodeEditor)).toEqual(fileContent03)
})

test('imports and exports', () => {
  const { audioTracker, audioNodeEditor } = setup('Tracks')

  /** @type {FileContent} */
  const empty = {
    nodeEditor: {
      zoom: `${defaultZoom}`,
      'pan-x': `${defaultPanX}`,
      'pan-y': `${defaultPanY}`,
    },
    nodes: [],
    links: [],
    tracker: {
      tempo: defaultTempo,
      lines: defaultLines,
      linesPerBeat: defaultLinesPerBeat,
    },
    tracks: [],
    audioFiles: [],
  }

  expect(exportFile(audioTracker, audioNodeEditor)).toEqual(empty)

  importFile(fileContent, audioTracker, audioNodeEditor)
  expect(exportFile(audioTracker, audioNodeEditor)).toEqual(fileContent)

  clearAll(audioTracker, audioNodeEditor)
  expect(exportFile(audioTracker, audioNodeEditor)).toEqual(empty)
})
