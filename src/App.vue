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

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500');
:root {
  --primary: 29, 233, 182;
  --primary-light: 110, 255, 232;
  --primary-dark: 0, 182, 134;
  --on-primary: 0, 0, 0;
  --on-primary-light: var(--on-primary);
  --on-primary-dark: var(--on-primary);

  --background: 0, 10, 18;
  --on-background: 255, 255, 255;
}
html {
  height: 100%;
}
body {
  margin: 0;
  height: 100%;
  background-color: rgba(var(--background), 0.85);
  font-family: 'Roboto', sans-serif;
}
#app {
  overflow: hidden;
  height: 100%;
}

.headline1,
h1 {
  font-size: 96px;
  font-weight: 300;
}
.headline2,
h2 {
  font-size: 60px;
  font-weight: 300;
}
.headline3,
h3 {
  font-size: 48px;
  font-weight: 400;
}
.headline4,
h4 {
  font-size: 34px;
  font-weight: 400;
}
.headline5,
h5 {
  font-size: 24px;
  font-weight: 400;
}
.headline6,
h6 {
  font-size: 20px;
  font-weight: 500;
}
.subtitle1 {
  font-size: 16px;
  font-weight: 400;
}
.subtitle2 {
  font-size: 14px;
  font-weight: 500;
}
.body1 {
  font-size: 16px;
  font-weight: 400;
}
.body2 {
  font-size: 14px;
  font-weight: 400;
}
.button {
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
}
.caption {
  font-size: 12px;
  font-weight: 400;
}
.overline {
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
}
</style>
