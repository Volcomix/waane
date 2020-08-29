import { expect, it } from '@jest/globals'
import elevation from './elevation'

for (let z = 0; z < 25; z++) {
  it(`returns elevation styles for z=${z}`, () => {
    expect(elevation(z)).toMatchSnapshot()
  })
}
