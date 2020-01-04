let moduleHandle

beforeAll(async () => {
  await page.goto('http://localhost:8080/test.html')
  moduleHandle = await page.evaluateHandle(/* js */ `
    import('./components/typography/typography.js')
  `)
})

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
  it(`returns typography styles for ${name}`, async () => {
    const typography = await page.evaluate(
      ({ default: typography }, name) => typography(name),
      moduleHandle,
      name,
    )
    expect(typography).toMatchSnapshot()
  })
}
