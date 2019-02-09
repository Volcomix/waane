<template>
  <div
    v-if="value"
    ref="scrim"
    class="scrim"
    @mouseenter.once="translate"
    @mousedown.self="hide"
  >
    <ol
      ref="menu"
      class="menu body2"
      :class="visibility"
      :style="position"
      @mouseup="hide"
    >
      <slot />
    </ol>
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
      hasPosition: false,
    }
  },
  computed: {
    position() {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
      }
    },
    visibility() {
      return {
        hidden: !this.hasPosition,
      }
    },
  },
  methods: {
    translate(event) {
      const { scrim, menu } = this.$refs
      this.x = Math.min(event.clientX, scrim.clientWidth - menu.clientWidth)
      if (event.clientY + menu.clientHeight > scrim.clientHeight) {
        this.y = event.clientY - menu.clientHeight
      } else {
        this.y = event.clientY
      }
      this.hasPosition = true
    },
    hide() {
      this.hasPosition = false
      this.$emit('input', false)
    },
  },
}
</script>

<style scoped>
.scrim {
  position: fixed;
  width: 100%;
  height: 100%;
}
.menu {
  position: absolute;
  transition: opacity 150ms var(--easing-decelerate);
  margin: 0;
  min-width: 112px;
  padding: 8px 0;
  background-color: rgb(var(--background));
  color: rgb(var(--on-background));
  list-style-type: none;
  pointer-events: none;
}
.menu > * {
  pointer-events: auto;
}
.hidden {
  opacity: 0;
}
</style>
