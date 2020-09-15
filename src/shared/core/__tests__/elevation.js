import { expect, test } from '@jest/globals'
import elevation from '../elevation'

for (let z = 0; z < 25; z++) {
  test(`returns styles for z=${z}`, () => {
    expect(elevation(z)).toMatchSnapshot()
  })
}
