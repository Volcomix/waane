/** @type {Map<string, number>} */
const nextIdsByKey = new Map()

/**
 * @param {string} key
 */
export function nextId(key) {
  const id = nextIdsByKey.get(key) || 1
  nextIdsByKey.set(key, id + 1)
  return id
}

export function clearAllIds() {
  nextIdsByKey.clear()
}
