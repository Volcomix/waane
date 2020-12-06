/**
 * @param {HTMLElement} element
 */
export function isField(element) {
  return element.matches('w-text-field, w-number-field, w-select, w-file')
}
