import { newE2EPage } from '@stencil/core/testing'

describe('node-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<w-node-editor></w-node-editor>')

    const element = await page.find('w-node-editor')
    expect(element).toHaveClass('hydrated')
  })
})
