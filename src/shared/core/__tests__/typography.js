import { expect, test } from '@jest/globals'
import typography, { typescale } from '../typography'

Object.keys(typescale).forEach((/** @type {keyof typeof typescale} */ name) => {
  test(`returns styles for ${name}`, () => {
    expect(typography(name)).toMatchSnapshot()
  })
})
