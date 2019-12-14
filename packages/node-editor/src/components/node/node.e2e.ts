import { newE2EPage } from '@stencil/core/testing'

describe('w-node', () => {
  it('renders', async () => {
    const page = await newE2EPage()
    await page.setContent('<w-node></w-node>')

    const element = await page.find('w-node')
    expect(element).toHaveClass('hydrated')
  })
})
