import { expect, it } from '@jest/globals'
import './link'

it('updates the bounding box', () => {
  const element = document.createElement('w-link')
  element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
  expect(element.style).toMatchObject({
    left: '10px',
    top: '20px',
    width: '20px',
    height: '20px',
  })
})

it('updates the bounding box when the link goes from right to left', () => {
  const element = document.createElement('w-link')
  element.update({ x: 30, y: 20 }, { x: 10, y: 40 })
  expect(element.style).toMatchObject({
    left: '10px',
    top: '20px',
    width: '20px',
    height: '20px',
  })
})

it('updates the bounding box when the link goes from bottom to top', () => {
  const element = document.createElement('w-link')
  element.update({ x: 10, y: 40 }, { x: 30, y: 20 })
  expect(element.style).toMatchObject({
    left: '10px',
    top: '20px',
    width: '20px',
    height: '20px',
  })
})

it('removes the bounding box without fromPosition', () => {
  const element = document.createElement('w-link')
  element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
  element.update(null, { x: 30, y: 40 })
  expect(element.style).toMatchObject({
    left: '',
    top: '',
    width: '',
    height: '',
  })
})

it('removes the bounding box without toPosition', () => {
  const element = document.createElement('w-link')
  element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
  element.update({ x: 10, y: 20 }, null)
  expect(element.style).toMatchObject({
    left: '',
    top: '',
    width: '',
    height: '',
  })
})

it('updates the path', () => {
  const element = document.createElement('w-link')
  element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
  const path = element.shadowRoot.querySelector('path').getAttribute('d')
  expect(path).toBe('M 0,0 C 10,0 10,20 20,20')
})

it('updates the path when the link goes from right to left', () => {
  const element = document.createElement('w-link')
  element.update({ x: 30, y: 20 }, { x: 10, y: 40 })
  const path = element.shadowRoot.querySelector('path').getAttribute('d')
  expect(path).toBe('M 20,0 C 30,0 -10,20 0,20')
})

it('updates the path when the link goes from bottom to top', () => {
  const element = document.createElement('w-link')
  element.update({ x: 10, y: 40 }, { x: 30, y: 20 })
  const path = element.shadowRoot.querySelector('path').getAttribute('d')
  expect(path).toBe('M 0,20 C 10,20 10,0 20,0')
})

it('erases the path without fromPosition', () => {
  const element = document.createElement('w-link')
  element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
  element.update(null, { x: 30, y: 40 })
  const path = element.shadowRoot.querySelector('path').getAttribute('d')
  expect(path).toBeNull()
})

it('erases the path without toPosition', () => {
  const element = document.createElement('w-link')
  element.update({ x: 10, y: 20 }, { x: 30, y: 40 })
  element.update({ x: 10, y: 20 }, null)
  const path = element.shadowRoot.querySelector('path').getAttribute('d')
  expect(path).toBeNull()
})
