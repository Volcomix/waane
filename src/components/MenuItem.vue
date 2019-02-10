<template>
  <li class="menu-item" @mouseup="$emit('click', $event)">
    <slot />
  </li>
</template>

<script>
export default {
  name: 'MenuItem',
}
</script>

<style scoped>
.menu-item {
  padding: 0 16px;
  cursor: pointer;
  user-select: none;
  line-height: 36px;
}
.menu-item:hover {
  background-color: rgba(var(--primary), 0.04);
}
</style>
