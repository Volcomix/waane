<template>
  <NumberField
    :label="name"
    :min="nativeAudioParam.minValue"
    :max="nativeAudioParam.maxValue"
    v-model="value"
  />
</template>

<script>
import NumberField from './NumberField'

export default {
  name: 'AudioParam',
  components: {
    NumberField,
  },
  props: {
    name: String,
    nativeAudioParam: AudioParam,
  },
  data() {
    return {
      value: this.nativeAudioParam.value,
    }
  },
  watch: {
    value(value) {
      this.nativeAudioParam.value = value
    },
  },
}
</script>

<style scoped></style>
