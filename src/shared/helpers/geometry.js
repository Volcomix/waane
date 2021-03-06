/**
 * @typedef {object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {object} Box
 * @property {Point} min
 * @property {Point} max
 */

/**
 * @param {Box} a
 * @param {Box} b
 * @returns {boolean}
 */
export function doOverlap(a, b) {
  if (a.max.x < b.min.x || a.min.x > b.max.x) {
    return false
  }
  if (a.max.y < b.min.y || a.min.y > b.max.y) {
    return false
  }
  return true
}

/**
 * @param {Point} a
 * @param {Point} b
 * @returns {number}
 */
export function squaredDist(a, b) {
  const x = a.x - b.x
  const y = a.y - b.y
  return x * x + y * y
}
