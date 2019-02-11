<template>
  <div
    id="app"
    tabindex="-1"
    @contextmenu.prevent="showAddMenu"
    @mousemove="move"
    @mousedown.left="endMove"
    @mousedown.right="cancel"
    @keydown.escape="cancel"
  >
    <AudioNode
      v-for="(audioNode, index) in audioNodes"
      :key="index"
      v-bind="audioNode"
    />
    <StartIcon v-if="isStartIconVisible" />
    <AddMenu v-model="isAddMenuVisible" @add="add" />
    <AudioNode
      v-if="newAudioNode"
      v-bind="newAudioNode"
      :key="audioNodes.length"
    />
  </div>
</template>

<script>
import StartIcon from './components/StartIcon.vue'
import AddMenu from './components/AddMenu.vue'
import AudioNode from './components/AudioNode.vue'

export default {
  name: 'app',
  components: {
    StartIcon,
    AddMenu,
    AudioNode,
  },
  data() {
    return {
      isAddMenuVisible: false,
      newAudioNode: undefined,
      audioNodes: [],
    }
  },
  computed: {
    isStartIconVisible() {
      return (
        !this.isAddMenuVisible && !this.newAudioNode && !this.audioNodes.length
      )
    },
  },
  methods: {
    showAddMenu(event) {
      // Required to handle keydown events
      event.target.focus()
      this.isAddMenuVisible = true
    },
    add(audioNode) {
      this.newAudioNode = audioNode
    },
    move(event) {
      if (this.newAudioNode) {
        this.newAudioNode.x = event.clientX
        this.newAudioNode.y = event.clientY
      }
    },
    endMove() {
      if (this.newAudioNode) {
        this.audioNodes.push(this.newAudioNode)
        this.newAudioNode = undefined
      }
    },
    cancel() {
      this.isAddMenuVisible = false
      this.newAudioNode = undefined
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
  background-color: rgba(var(--background), 0.87);
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100%;
  user-select: none;
}
#app:focus {
  outline: none;
}
</style>
