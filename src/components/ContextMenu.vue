<template>
  <div
    v-if="value"
    ref="scrim"
    class="scrim"
    @mouseenter.once="translate"
    @mousedown.self="hide"
  >
    <div
      ref="container"
      class="container"
      :class="visibility"
      :style="position"
      @mouseup="hide"
    >
      <ol class="menu body2" @mouseup.self.stop>
        <slot />
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    value: Boolean,
  },
  data() {
    return {
      x: 0,
      y: 0,
      height: null,
      hasPosition: false,
    }
  },
  computed: {
    position() {
      if (this.hasPosition) {
        return {
          top: `${this.y}px`,
          left: `${this.x}px`,
          height: this.height ? `${this.height}px` : null,
        }
      }
      return null
    },
    visibility() {
      return {
        hidden: !this.hasPosition,
      }
    },
  },
  watch: {
    value(value) {
      if (!value) {
        this.hasPosition = false
      }
    },
  },
  methods: {
    translate(event) {
      const { clientX: mouseX, clientY: mouseY } = event
      const scrim = this.$refs.scrim.getBoundingClientRect()
      const container = this.$refs.container.getBoundingClientRect()
      this.x = Math.min(mouseX, scrim.width - container.width)
      if (mouseY + container.height <= scrim.height) {
        this.y = mouseY
        this.height = null
      } else if (mouseY - container.height >= 0) {
        this.y = mouseY - container.height
        this.height = null
      } else if (mouseY > scrim.height / 2) {
        this.y = 0
        this.height = mouseY
      } else {
        this.y = mouseY
        this.height = scrim.height - mouseY
      }
      this.hasPosition = true
    },
    hide() {
      this.$emit('input', false)
    },
  },
}
</script>

<style scoped>
.scrim {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  transition: opacity 150ms var(--easing-decelerate);
  border-radius: 4px;
  min-width: 112px;
  height: auto;
  background-color: rgba(var(--background), 0.95);
  color: rgb(var(--on-background));
  pointer-events: none;
}
.menu {
  overflow: auto;
  margin: 8px 0;
  padding: 0;
  list-style-type: none;
  pointer-events: auto;
}
.hidden {
  opacity: 0;
}
</style>
