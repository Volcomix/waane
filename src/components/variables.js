export default function(selector) {
  return /* HTML */ `
    <style>
      ${selector} {
        --background: var(--w-background, 18, 18, 18);
        --surface: var(--w-surface, 18, 18, 18);

        --on-background: var(--w-on-background, 255, 255, 255);
        --on-surface: var(--w-on-surface, 255, 255, 255);

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

        /* Set to none to disable (e.g. to remove the overlay on light theme) */
        --shadow: var(--w-shadow);
        --overlay: var(--w-overlay);
      }
    </style>
  `
}
