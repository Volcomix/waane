<template>
  <div class="container">
    <span class="header subtitle2">{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: 'AudioNode',
  props: {
    name: String,
  },
}
</script>

<style scoped>
.container {
  border-radius: 4px;
  min-width: 150px;
  padding: 0 16px 24px 16px;
  background-color: rgba(var(--background), 0.54);
  color: rgb(var(--on-background));
}
.header {
  display: flex;
  align-items: flex-end;
  height: 34px;
}
</style>
