import { expect, test } from '@jest/globals'
import exportFile from '../../helpers/export-file'
import importFile from '../../helpers/import-file'
import fileContent from '../../testing/bass-drum'
import { setup } from '../../testing/helpers'

test('imports and exports', () => {
  const { audioTracker, audioNodeEditor } = setup('Tracks')
  importFile(fileContent, audioTracker, audioNodeEditor)
  expect(exportFile(audioTracker, audioNodeEditor)).toEqual(fileContent)
})
