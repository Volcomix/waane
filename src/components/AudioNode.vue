<template>
  <div class="container" tabindex="-1" :style="position" v-on="$listeners">
    <span class="header subtitle2">
      {{ name }}
    </span>
    <ul class="list outputs body2">
      <li v-for="outputName in audioOutputs" :key="outputName">
        {{ outputName }}
      </li>
    </ul>
    <ul class="list body2">
      <li v-for="inputName in audioInputs" :key="inputName">
        {{ inputName }}
      </li>
      <li v-for="paramName in audioParams" :key="paramName">
        {{ paramName }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AudioNode',
  props: {
    name: String,
    x: Number,
    y: Number,
    nativeAudioNode: AudioNode,
  },
  computed: {
    position() {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
      }
    },
    audioOutputs() {
      if (this.nativeAudioNode.numberOfOutputs === 1) {
        return ['output']
      } else {
        return Array.from(
          { length: this.nativeAudioNode.numberOfOutputs },
          (v, k) => `output${k + 1}`,
        )
      }
    },
    audioInputs() {
      if (this.nativeAudioNode.numberOfInputs === 1) {
        return ['input']
      } else {
        return Array.from(
          { length: this.nativeAudioNode.numberOfInputs },
          (v, k) => `input${k + 1}`,
        )
      }
    },
    audioParams() {
      return Object.keys(Object.getPrototypeOf(this.nativeAudioNode)).filter(
        paramName => this.nativeAudioNode[paramName] instanceof AudioParam,
      )
    },
  },
  mounted() {
    this.$el.focus()
  },
}
</script>

<style scoped>
.container {
  position: absolute;
  transition: box-shadow 100ms var(--easing-standard);
  border-radius: 4px;
  min-width: 150px;
  padding: 0 16px 24px 16px;
  background-color: rgba(var(--background), 0.54);
  color: rgb(var(--on-background));
}
.container:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(var(--primary));
}
.header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 14px;
  height: 34px;
}
.list {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style-type: none;
  line-height: 28px;
  text-transform: capitalize;
  color: rgba(var(--on-background), 0.6);
}
.outputs {
  align-items: flex-end;
}
</style>
