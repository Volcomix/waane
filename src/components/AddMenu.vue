<template>
  <ContextMenu :value="value" v-on="$listeners">
    <MenuItem
      v-for="audioNode in audioNodes"
      :key="audioNode.method"
      @click="log(audioNode)"
    >
      {{ audioNode.name }}
    </MenuItem>
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
  computed: {
    audioNodes() {
      return Object.keys(BaseAudioContext.prototype)
        .filter(method => method.startsWith('create'))
        .map(method => ({
          name: method.substring('create'.length),
          method,
        }))
        .filter(({ name }) => window[`${name}Node`])
        .map(({ name, method }) => ({
          name: name.replace(/(.)([A-Z][a-z])/g, '$1 $2'),
          method,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    },
  },
  methods: {
    log(message) {
      console.log(message)
    },
  },
}
</script>
