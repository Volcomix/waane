import { bindAudioInput } from './use-audio-link.js'

/**
 * @typedef {import('../shared/base/select.js').default} Select
 * @typedef {import('../shared/base/number-field.js').default} NumberField
 * @typedef {import('../shared/core/element.js').PropertyTypes} PropertyTypes
 */

/**
 * @template {PropertyTypes} T
 * @typedef {import('../shared/core/element.js').SetupOptions<T>} SetupOptions
 */

/**
 * @template {PropertyTypes} T
 * @typedef {import('../shared/core/element.js').Setup<T>} Setup
 */

/**
 * @template {PropertyTypes} T
 * @callback UseAudioProperty
 * @param {Select} field
 * @param {AudioNode} audioNode
 * @param {keyof T} propertyName
 * @returns {void}
 */

/**
 * @template {PropertyTypes} T
 * @callback UseAudioParam
 * @param {NumberField} numberField
 * @param {AudioNode} audioNode
 * @param {keyof T} propertyName
 * @returns {void}
 */

/**
 * @template {PropertyTypes} T
 * @typedef {object} UseAudioNodeOptions
 * @property {UseAudioProperty<T>} useAudioProperty
 * @property {UseAudioParam<T>} useAudioParam
 */

/**
 * @template {PropertyTypes} T
 * @typedef {SetupOptions<T> & UseAudioNodeOptions<T>} CreateAudioNodeOptions
 */

/**
 * @template {PropertyTypes} T
 * @param {(options: CreateAudioNodeOptions<T>) => void} setup
 * @returns {Setup<T>}
 */
export default function createAudioNode(setup) {
  return function (options) {
    setup({
      ...options,
      useAudioProperty(field, /** @type {any} */ audioNode, propertyName) {
        field.value = audioNode[propertyName]

        field.addEventListener('change', () => {
          audioNode[propertyName] = field.value
        })
      },
      useAudioParam(numberField, /** @type {any} */ audioNode, propertyName) {
        /** @type {AudioParam} */
        const audioParam = audioNode[propertyName]
        numberField.value = audioParam.value
        bindAudioInput(numberField.closest('w-graph-node-input'), audioParam)

        numberField.addEventListener('input', () => {
          audioParam.value = numberField.value
        })
      },
    })
  }
}
