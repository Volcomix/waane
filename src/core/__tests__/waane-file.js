import { expect, test } from '@jest/globals'
import exportFile from '../../helpers/export-file'
import importFile from '../../helpers/import-file'
import fileContent01 from '../../testing/bass-drum-0.1'
import fileContent02 from '../../testing/bass-drum-0.2'
import fileContent from '../../testing/drum-kit'
import { setup } from '../../testing/helpers'

test('migrates from 0.1 to 0.2', () => {
  const { audioTracker, audioNodeEditor } = setup('Tracks')
  importFile(fileContent01, audioTracker, audioNodeEditor)
  expect(exportFile(audioTracker, audioNodeEditor)).toEqual(fileContent02)
})

test('imports and exports', () => {
  const { audioTracker, audioNodeEditor } = setup('Tracks')
  importFile(fileContent, audioTracker, audioNodeEditor)
  expect(exportFile(audioTracker, audioNodeEditor)).toEqual(fileContent)
})
