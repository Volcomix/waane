<template>
  <div
    id="app"
    tabindex="-1"
    @contextmenu.prevent="showAddMenu"
    @mousemove="moveNode"
    @mouseup.left="endMovingNode"
    @mousedown.left="endAddingNode"
    @mousedown.right="cancel"
    @keydown.escape="cancel"
  >
    <AudioNode
      v-for="(audioNode, index) in audioNodes"
      :key="audioNode.id"
      v-bind="audioNode"
      @mousedown.left="startMovingNode(index, $event)"
      @keydown.delete="deleteNode(index)"
    />
    <AudioNode
      v-if="newAudioNode"
      :key="newAudioNode.id"
      v-bind="newAudioNode"
    />
    <StartIcon v-if="isStartIconVisible" />
    <AddMenu v-model="isAddMenuVisible" @add="startAddingNode" />
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
      audioNodes: [],
      isAddMenuVisible: false,
      newAudioNode: undefined,
      movingAudioNode: undefined,
      movingOffset: {
        x: 0,
        y: 0,
      },
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
    showAddMenu() {
      this.isAddMenuVisible = true
    },
    startAddingNode(audioNode) {
      const maxId = this.audioNodes.reduce(
        (maxId, audioNode) => Math.max(maxId, audioNode.id),
        0,
      )
      this.newAudioNode = { ...audioNode, id: maxId + 1 }
    },
    startMovingNode(index, event) {
      const [audioNode] = this.audioNodes.splice(index, 1)
      this.audioNodes.push(audioNode)
      this.movingAudioNode = audioNode
      this.movingOffset.x = audioNode.x - event.clientX
      this.movingOffset.y = audioNode.y - event.clientY
    },
    moveNode(event) {
      if (this.newAudioNode) {
        // -2 to keep focus when pressing mouse down on Firefox
        this.newAudioNode.x = event.clientX - 2
        this.newAudioNode.y = event.clientY - 2
      }
      if (this.movingAudioNode) {
        this.movingAudioNode.x = event.clientX + this.movingOffset.x
        this.movingAudioNode.y = event.clientY + this.movingOffset.y
      }
    },
    endAddingNode() {
      if (this.newAudioNode) {
        this.audioNodes.push(this.newAudioNode)
        this.newAudioNode = undefined
      }
    },
    endMovingNode() {
      this.movingAudioNode = undefined
    },
    cancel() {
      this.isAddMenuVisible = false
      this.newAudioNode = undefined
      this.movingAudioNode = undefined
    },
    deleteNode(index) {
      this.audioNodes.splice(index, 1)
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
