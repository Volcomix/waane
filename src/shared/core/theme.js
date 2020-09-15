import { css } from './element.js'

const style = document.createElement('style')
style.innerHTML = css`
  :root {
    --color-primary: 187 134 252;
    --color-secondary: 3 218 198;
    --color-background: 18 18 18;
    --color-surface: 18 18 18;

    --color-on-primary: 0 0 0;
    --color-on-secondary: 0 0 0;
    --color-on-background: 255 255 255;
    --color-on-surface: 255 255 255;

    --text-high-emphasis: 0.87;
    --text-medium-emphasis: 0.6;
    --text-disabled: 0.38;
  }

  body {
    background-color: rgb(var(--color-background));
    color: rgb(var(--color-on-background));
  }
`
document.head.appendChild(style)
