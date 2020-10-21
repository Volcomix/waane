import { css } from './element.js'

const style = document.createElement('style')
style.textContent = css`
  :root {
    --color-primary: 98 0 238;
    --color-secondary: 3 218 198;
    --color-additional1: 74 33 253;
    --color-additional2: 153 153 153;
    --color-background: 255 255 255;
    --color-surface: 255 255 255;
    --color-error: 176 0 32;

    --color-on-primary: 255 255 255;
    --color-on-secondary: 0 0 0;
    --color-on-background: 0 0 0;
    --color-on-surface: 0 0 0;

    /* Set to none to disable (e.g. to remove the overlay on light theme) */
    --shadow: initial;
    --overlay: none;

    --text-high-emphasis: 0.87;
    --text-medium-emphasis: 0.6;
    --text-disabled: 0.38;

    --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
    --easing-decelerated: cubic-bezier(0, 0, 0.2, 1);
    --easing-accelerated: cubic-bezier(0.4, 0, 1, 1);
  }

  body {
    margin: 0;
    background-color: rgb(var(--color-background));
    color: rgba(var(--color-on-background) / var(--text-high-emphasis));
  }
`
document.head.appendChild(style)
