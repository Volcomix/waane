<template>
  <li class="list-item" v-on="$listeners"><slot /></li>
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
  user-select: none;
  line-height: 48px;
}
.list-item:hover {
  background-color: rgba(var(--primary), 0.09);
}
</style>
