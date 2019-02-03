<template>
  <div
    v-if="value"
    ref="scrim"
    class="scrim"
    @contextmenu.prevent.stop
    @mouseenter.once="translate"
    @mousedown.self="hide"
  >
    <ul ref="menu" class="menu body2" :class="visibility" :style="position">
      <slot />
    </ul>
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
      this.y = Math.min(event.clientY, scrim.clientHeight - menu.clientHeight)
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
  margin: 0;
  padding: 8px 16px;
  background-color: rgb(var(--background));
  color: rgb(var(--on-background));
  list-style-type: none;
}
.hidden {
  visibility: hidden;
}
</style>
