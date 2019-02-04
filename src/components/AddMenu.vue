<template>
  <ContextMenu :value="value" v-on="$listeners">
    <MenuItem>Sloubi</MenuItem>
    <MenuItem>Testouille</MenuItem>
  </ContextMenu>
</template>

<script>
import ContextMenu from './ContextMenu.vue'
import MenuItem from './MenuItem.vue'

export default {
  name: 'AddMenu',
  components: {
    ContextMenu,
    MenuItem,
  },
  props: {
    value: Boolean,
  },
}
</script>
