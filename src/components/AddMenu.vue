<template>
  <ContextMenu :value="value" v-on="$listeners">
    <MenuItem @click="log('Sloubi')">Sloubi</MenuItem>
    <MenuItem @click="log('Pipoup')">Pipoup</MenuItem>
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
  methods: {
    log(message) {
      console.log(message)
    },
  },
}
</script>
