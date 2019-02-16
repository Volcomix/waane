<template>
  <div class="container" tabindex="-1" :style="position" v-on="$listeners">
    <span class="header subtitle2">{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: 'AudioNode',
  props: {
    name: String,
    x: Number,
    y: Number,
  },
  computed: {
    position() {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
      }
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
  height: 34px;
}
</style>
