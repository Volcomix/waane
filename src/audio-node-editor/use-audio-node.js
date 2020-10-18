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
 * @template {PropertyTypes} T, U
 * @typedef {{ [K in keyof T]: T[K] extends U ? K : never }} FilterProperties
 */

/**
 * @template {PropertyTypes} T, U
 * @typedef {FilterProperties<T, U>[keyof T]} FilterPropertyNames
 */

/**
 * @template {PropertyTypes} T
 * @callback UseAudioProperty
 * @param {Select} field
 * @param {AudioNode} audioNode
 * @param {FilterPropertyNames<T, typeof String>} propertyName
 * @returns {void}
 */

/**
 * @template {PropertyTypes} T
 * @callback UseAudioParam
 * @param {NumberField} numberField
 * @param {AudioNode} audioNode
 * @param {FilterPropertyNames<T, typeof Number>} propertyName
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
    const { host, observe } = options
    setup({
      ...options,
      useAudioProperty(field, /** @type {any} */ audioNode, propertyName) {
        if (host.hasAttribute(/** @type {string} */ (propertyName))) {
          audioNode[propertyName] = host[propertyName]
        } else {
          host[propertyName] = audioNode[propertyName]
        }
        field.value = audioNode[propertyName]

        observe(propertyName, () => {
          field.value = /** @type {string} */ (host[propertyName])
          audioNode[propertyName] = host[propertyName]
        })

        field.addEventListener('change', () => {
          host[propertyName] = /** @type {any} */ (field.value)
        })
      },
      useAudioParam(numberField, /** @type {any} */ audioNode, propertyName) {
        /** @type {AudioParam} */
        const audioParam = audioNode[propertyName]
        if (host.hasAttribute(/** @type {string} */ (propertyName))) {
          audioParam.value = /** @type {number} */ (host[propertyName])
        } else {
          host[propertyName] = /** @type {any} */ (audioParam.value)
        }
        numberField.value = audioParam.value
        bindAudioInput(numberField.closest('w-graph-node-input'), audioParam)

        observe(propertyName, () => {
          numberField.value = /** @type {number} */ (host[propertyName])
          audioNode[propertyName].value = host[propertyName]
        })

        numberField.addEventListener('input', () => {
          host[propertyName] = /** @type {any} */ (numberField.value)
        })
      },
    })
  }
}
