/** @typedef {HTMLElement & { selected: boolean }} SelectableElement */

/**
 * @param {HTMLElement} container
 * @param {string} tagName
 */
export default function useSelection(container, tagName) {
  const tagNameUpperCase = tagName.toUpperCase()

  container.addEventListener('click', (event) => {
    if (!event.ctrlKey) {
      container.querySelectorAll(`${tagName}[selected]`).forEach((
        /** @type {SelectableElement} */ element,
      ) => {
        element.selected = false
      })
    }

    let element = /** @type {Element} */ (event.target)
    while (element !== container) {
      if (element.tagName === tagNameUpperCase) {
        const clickedElement = /** @type {SelectableElement} */ (element)
        clickedElement.selected = event.ctrlKey
          ? !clickedElement.selected
          : true
        break
      }
      element = element.parentElement
    }
  })
}
