<template>
  <ContextMenu :value="value" v-on="$listeners">
    <li>Sloubi</li>
    <li>Testouille</li>
  </ContextMenu>
</template>

<script>
import ContextMenu from './ContextMenu.vue'

export default {
  name: 'AddMenu',
  components: {
    ContextMenu,
  },
  props: {
    value: Boolean,
  },
}
</script>
