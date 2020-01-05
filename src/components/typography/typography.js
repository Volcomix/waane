import { css } from '../waane-element.js'

const typeface = 'var(--typeface)'
const light = `var(--font-light)`
const regular = `var(--font-regular)`
const medium = `var(--font-medium)`

const typescale = {
  headline1: [light, 96, null, -1.5],
  headline2: [light, 60, null, -0.5],
  headline3: [regular, 48, null, 0],
  headline4: [regular, 34, null, 0.25],
  headline5: [regular, 24, null, 0],
  headline6: [medium, 20, null, 0.15],
  subtitle1: [regular, 16, null, 0.15],
  subtitle2: [medium, 14, null, 0.1],
  body1: [regular, 16, null, 0.5],
  body2: [regular, 14, null, 0.25],
  button: [medium, 14, 'uppercase', 1.25],
  caption: [regular, 12, null, 0.4],
  overline: [regular, 10, 'uppercase', 1.5],
}

export default function typography(name) {
  const [font, size, textTransform, letterSpacing] = typescale[name]
  return css`
    font-size: ${size}px;
    font-family: ${typeface};
    font-weight: ${font};
    text-transform: ${textTransform || 'none'};
    letter-spacing: ${letterSpacing}px;
  `
}
