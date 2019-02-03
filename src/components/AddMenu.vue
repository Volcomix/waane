<template>
  <div
    v-if="value"
    class="scrim"
    @contextmenu.prevent.stop
    @mouseenter.once="translate"
    @mousedown.self="hide"
  >
    <ul v-show="hasPosition" class="menu body2" :style="position">
      Sloubi
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AddMenu',
  props: {
    value: Boolean,
  },
  data() {
    return {
      hasPosition: false,
      x: 0,
      y: 0,
    }
  },
  computed: {
    position() {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
      }
    },
  },
  methods: {
    translate(event) {
      this.hasPosition = true
      this.x = event.clientX
      this.y = event.clientY
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
}
</style>
