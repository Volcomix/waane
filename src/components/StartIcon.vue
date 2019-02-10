<template>
  <transition appear>
    <svg class="container" width="24" height="24" viewBox="0 0 24 24">
      <path d="M 11,1.07 C 7.05,1.56 4,4.92 4,9 h 7 z" />
      <path d="m 4,15 c 0,4.42 3.58,8 8,8 4.42,0 8,-3.58 8,-8 V 11 H 4 Z" />
      <path
        class="right-button"
        d="M 13,1.07 V 9 h 7 C 20,4.92 16.95,1.56 13,1.07 Z"
      />
    </svg>
  </transition>
</template>

<script>
export default {
  name: 'StartIcon',
}
</script>

<style scoped>
.container {
  width: 192px;
  height: 192px;
  fill: rgb(var(--on-background));
}
.right-button {
  fill: rgb(var(--primary));
}
.v-enter-active,
.v-leave-active {
  transition-property: opacity, transform;
}
.v-enter-active {
  transition-duration: 500ms;
  transition-timing-function: var(--easing-decelerate);
}
.v-leave-active {
  transition-duration: 75ms;
  transition-timing-function: var(--easing-accelerate);
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
