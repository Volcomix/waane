import { expect, it } from '@jest/globals'
import typography from './typography'

const names = [
  'headline1',
  'headline2',
  'headline3',
  'headline4',
  'headline5',
  'headline6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'button',
  'caption',
  'overline',
]

for (const name of names) {
  it(`returns typography styles for ${name}`, () => {
    expect(typography(name)).toMatchSnapshot()
  })
}
