<template>
  <div id="app" @contextmenu.prevent="showAddMenu">
    <AddMenu v-model="isAddMenuVisible" />
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import AddMenu from './components/AddMenu.vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    AddMenu,
    HelloWorld,
  },
  data() {
    return {
      isAddMenuVisible: false,
    }
  },
  methods: {
    showAddMenu() {
      this.isAddMenuVisible = true
    },
  },
}
</script>

<style src="./styles/theme.css"></style>
<style src="./styles/typography.css"></style>
<style>
html {
  height: 100%;
}
body {
  margin: 0;
  height: 100%;
  background-color: rgba(var(--background), 0.85);
}
#app {
  overflow: hidden;
  height: 100%;
}
</style>
