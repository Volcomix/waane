import { expect, test } from '@jest/globals'
import { doOverlap, squaredDist } from '../geometry'

test('boxes do not overlap', () => {
  expect(
    doOverlap(
      {
        min: { x: 0, y: 0 },
        max: { x: 1, y: 1 },
      },
      {
        min: { x: 2, y: 0 },
        max: { x: 3, y: 1 },
      },
    ),
  ).toBe(false)
})

test('boxes overlap', () => {
  expect(
    doOverlap(
      {
        min: { x: 0, y: 0 },
        max: { x: 3, y: 3 },
      },
      {
        min: { x: 1, y: 1 },
        max: { x: 2, y: 2 },
      },
    ),
  ).toBe(true)
})

test('squaredDist', () => {
  expect(squaredDist({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(2)
})
