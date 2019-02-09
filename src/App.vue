<template>
  <div id="app" @contextmenu.prevent="showAddMenu">
    <StartIcon v-if="isStartIconVisible" />
    <AddMenu v-model="isAddMenuVisible" />
  </div>
</template>

<script>
import StartIcon from './components/StartIcon.vue'
import AddMenu from './components/AddMenu.vue'

export default {
  name: 'app',
  components: {
    StartIcon,
    AddMenu,
  },
  data() {
    return {
      isAddMenuVisible: false,
    }
  },
  computed: {
    isStartIconVisible() {
      return !this.isAddMenuVisible
    },
  },
  methods: {
    showAddMenu() {
      this.isAddMenuVisible = true
    },
  },
}
</script>

<style src="./styles/theme.css"></style>
<style src="./styles/transition.css"></style>
<style src="./styles/typography.css"></style>
<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons');

html {
  height: 100%;
}
body {
  margin: 0;
  height: 100%;
  background-color: rgba(var(--background), 0.85);
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100%;
}
</style>
