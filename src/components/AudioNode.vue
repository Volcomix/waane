<template>
  <div class="container" tabindex="-1" :style="position" v-on="$listeners">
    <h1 class="header subtitle2">
      {{ name }}
    </h1>
    <ul class="outputs body2">
      <li v-for="outputName in audioOutputs" :key="outputName" class="output">
        {{ outputName }}
        <div
          class="link-point"
          @mousedown.left.stop="startOutputLink(outputName, $event)"
          @mousemove="snapOutputLink(outputName, $event)"
          @mouseup.left="endOutputLink(outputName, $event)"
        />
      </li>
    </ul>
    <ul class="inputs body2">
      <li v-for="inputName in audioInputs" :key="inputName" class="input">
        <div
          class="link-point"
          @mousedown.left.stop="startInputLink(inputName, $event)"
          @mousemove="snapInputLink(inputName, $event)"
          @mouseup.left="endInputLink(inputName, $event)"
        />
        {{ inputName }}
      </li>
      <li v-for="paramName in audioParams" :key="paramName" class="param">
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
  methods: {
    startOutputLink(outputName, event) {
      this.$emit('link-start', {
        start: {
          outputName,
          ...this.linkPointCenter(event),
        },
        end: {
          x: event.clientX,
          y: event.clientY,
        },
      })
    },
    startInputLink(inputName, event) {
      this.$emit('link-start', {
        start: {
          x: event.clientX,
          y: event.clientY,
        },
        end: {
          inputName,
          ...this.linkPointCenter(event),
        },
      })
    },
    snapOutputLink(outputName, event) {
      this.$emit(
        'link-snap',
        {
          start: {
            outputName,
            ...this.linkPointCenter(event),
          },
        },
        event,
      )
    },
    snapInputLink(inputName, event) {
      this.$emit(
        'link-snap',
        {
          end: {
            inputName,
            ...this.linkPointCenter(event),
          },
        },
        event,
      )
    },
    endOutputLink(outputName, event) {
      this.$emit('link-end', {
        start: {
          outputName,
          ...this.linkPointCenter(event),
        },
      })
    },
    endInputLink(inputName, event) {
      this.$emit('link-end', {
        end: {
          inputName,
          ...this.linkPointCenter(event),
        },
      })
    },
    linkPointCenter(event) {
      const { x, y, width, height } = event.target.getBoundingClientRect()
      return {
        x: x + width / 2,
        y: y + height / 2,
      }
    },
  },
}
</script>

<style scoped>
.container {
  position: absolute;
  transition: box-shadow 100ms var(--easing-standard);
  border-radius: 4px;
  min-width: 150px;
  padding: 0 0 24px 0;
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
  margin: 0 16px 14px 16px;
  height: 34px;
}
.outputs,
.inputs {
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
.output,
.input {
  display: flex;
  align-items: center;
}
.link-point {
  border-radius: 12px;
  width: 24px;
  height: 24px;
  background: radial-gradient(#cddc39 5px, transparent 5px);
}
.output .link-point {
  margin-right: -12px;
  margin-left: 4px;
}
.input .link-point {
  margin-right: 4px;
  margin-left: -12px;
}
.param {
  margin-left: 16px;
}
</style>
