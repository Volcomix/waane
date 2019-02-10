<template>
  <ContextMenu :value="value" v-on="$listeners">
    <MenuItem
      v-for="audioNode in audioNodes"
      :key="audioNode"
      @click="log(audioNode)"
    >
      {{ audioNode }}
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
        .map(method => method.substring('create'.length))
        .filter(nodeName => window[`${nodeName}Node`])
        .sort()
    },
  },
  methods: {
    log(message) {
      console.log(message)
    },
  },
}
</script>
