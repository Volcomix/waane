import { css } from './waane-element.js'

export default css`
  --primary: var(--w-primary, 135, 203, 255);
  --secondary: var(--w-secondary, 246, 199, 126);
  --background: var(--w-background, 18, 18, 18);
  --surface: var(--w-surface, 18, 18, 18);

  --on-primary: var(--w-on-primary, 0, 0, 0);
  --on-secondary: var(--w-on-secondary, 0, 0, 0);
  --on-background: var(--w-on-background, 255, 255, 255);
  --on-surface: var(--w-on-surface, 255, 255, 255);

  --surface-opacity: var(--w-surface-opacity, 0.87);

  /* Set to none to disable (e.g. to remove the overlay on light theme) */
  --shadow: var(--w-shadow);
  --overlay: var(--w-overlay);

  --typeface: var(--w-typeface, 'Roboto', sans-serif);

  --font-light: var(--w-font-light, 300);
  --font-regular: var(--w-font-regular, 400);
  --font-medium: var(--w-font-medium, 500);

  --high-emphasis: var(--w-high-emphasis, 0.87);
  --medium-emphasis: var(--w-medium-emphasis, 0.6);
  --disabled: var(--w-disabled, 0.38);

  --shadow-color: var(--w-shadow-color, 0, 0, 0);
  --umbra-opacity: var(--w-umbra-opacity, 0.2);
  --penumbra-opacity: var(--w-penumbra-opacity, 0.14);
  --ambient-opacity: var(--w-ambient-opacity, 0.12);

  --easing-standard: var(--w-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  --easing-decelerate: var(--w-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  --easing-accelerate: var(--w-easing-accelerate, cubic-bezier(0.4, 0, 1, 1));
`
