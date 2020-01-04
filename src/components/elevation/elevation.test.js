let moduleHandle

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  moduleHandle = await page.evaluateHandle(/* js */ `
    import('./components/elevation/elevation.js')
  `)
})

for (let z = 0; z < 25; z++) {
  it(`returns elevation styles for z=${z}`, async () => {
    const elevation = await page.evaluate(
      ({ default: elevation }, z) => elevation(z),
      moduleHandle,
      z,
    )
    expect(elevation).toMatchSnapshot()
  })
}
