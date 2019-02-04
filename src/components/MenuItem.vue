<template>
  <li class="list-item"><slot /></li>
</template>

<script>
export default {
  name: 'MenuItem',
}
</script>

<style scoped>
.list-item {
  padding: 0 16px;
  cursor: pointer;
  line-height: 48px;
}
.list-item:hover {
  background-color: rgba(var(--primary), 0.08);
}
</style>
