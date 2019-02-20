<template>
  <div
    id="app"
    tabindex="-1"
    @contextmenu.prevent="showAddMenu"
    @mousemove="move"
    @mouseup.left="endMoving"
    @mousedown.left="endAddingNode"
    @mousedown.right="cancel"
    @keydown.escape="cancel"
    @keydown.ctrl.86="pasteNode"
  >
    <svg class="links">
      <path
        v-for="(link, index) in links"
        :key="index"
        class="link"
        :d="linkPath(link)"
      />
    </svg>
    <AudioNode
      v-for="(audioNode, index) in audioNodes"
      :key="audioNode.id"
      v-bind="audioNode"
      @mousedown.left="startMovingNode(index, $event)"
      @keydown.delete="deleteNode(index)"
      @keydown.ctrl.67="copyNode(audioNode)"
      @link-start="startAddingLink(audioNode, $event)"
      @link-snap="snapLink(audioNode, ...arguments)"
      @link-end="endAddingLink(audioNode, $event)"
    />
    <AudioNode
      v-if="newAudioNode"
      :key="newAudioNode.id"
      v-bind="newAudioNode"
    />
    <StartIcon v-if="isStartIconVisible" />
    <AddMenu v-model="isAddMenuVisible" @node-add="startAddingNode" />
    <svg v-if="newLink" class="links">
      <path class="link link-new" :d="newLinkPath" />
    </svg>
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
      audioContext: undefined,
      audioNodes: [],
      isAddMenuVisible: false,
      newAudioNode: undefined,
      movingAudioNode: undefined,
      movingOffset: {
        x: 0,
        y: 0,
      },
      clipboard: undefined,
      links: [],
      newLink: undefined,
    }
  },
  computed: {
    isStartIconVisible() {
      return (
        !this.isAddMenuVisible && !this.newAudioNode && !this.audioNodes.length
      )
    },
    newLinkPath() {
      return this.linkPath(this.newLink)
    },
  },
  methods: {
    showAddMenu() {
      this.isAddMenuVisible = true
    },
    startAddingNode(audioNode) {
      if (!this.audioContext) {
        this.audioContext = new AudioContext()
      }
      this.newAudioNode = this.createNode(audioNode)
    },
    startMovingNode(index, event) {
      const [audioNode] = this.audioNodes.splice(index, 1)
      this.audioNodes.push(audioNode)
      this.movingAudioNode = audioNode
      this.movingOffset.x = audioNode.x - event.clientX
      this.movingOffset.y = audioNode.y - event.clientY
    },
    move(event) {
      if (this.newAudioNode) {
        // -2 to keep focus when pressing mouse down on Firefox
        this.newAudioNode.x = event.clientX - 2
        this.newAudioNode.y = event.clientY - 2
      }
      if (this.movingAudioNode) {
        this.movingAudioNode.x = event.clientX + this.movingOffset.x
        this.movingAudioNode.y = event.clientY + this.movingOffset.y
      }
      if (this.newLink) {
        if (this.newLink.start.audioNode) {
          this.newLink.end.x = event.clientX
          this.newLink.end.y = event.clientY
        } else {
          this.newLink.start.x = event.clientX
          this.newLink.start.y = event.clientY
        }
      }
    },
    endAddingNode() {
      if (this.newAudioNode) {
        this.audioNodes.push(this.newAudioNode)
        this.newAudioNode = undefined
      }
    },
    endMoving() {
      this.movingAudioNode = undefined
      this.newLink = undefined
    },
    cancel() {
      this.isAddMenuVisible = false
      this.newAudioNode = undefined
      this.movingAudioNode = undefined
      this.newLink = undefined
    },
    deleteNode(index) {
      const [audioNode] = this.audioNodes.splice(index, 1)
      this.links = this.links.filter(
        link =>
          link.start.audioNode !== audioNode &&
          link.end.audioNode !== audioNode,
      )
    },
    copyNode(audioNode) {
      this.clipboard = { ...audioNode }
    },
    pasteNode() {
      if (this.clipboard) {
        this.clipboard.x += 8
        this.clipboard.y += 8
        this.audioNodes.push(this.createNode(this.clipboard))
      }
    },
    createNode(audioNode) {
      const maxId = this.audioNodes.reduce(
        (maxId, audioNode) => Math.max(maxId, audioNode.id),
        0,
      )
      const nativeAudioNode = this.audioContext[audioNode.method]()
      return { ...audioNode, id: maxId + 1, nativeAudioNode }
    },
    startAddingLink(audioNode, link) {
      if (link.start.outputName) {
        link.start.audioNode = audioNode
        link.start.x -= audioNode.x
        link.start.y -= audioNode.y
      } else {
        link.end.audioNode = audioNode
        link.end.x -= audioNode.x
        link.end.y -= audioNode.y
      }
      this.newLink = link
    },
    snapLink(audioNode, link, event) {
      if (!this.isValidLink(audioNode, link)) {
        return
      }
      event.stopPropagation()
      if (link.start) {
        this.newLink.start.x = link.start.x
        this.newLink.start.y = link.start.y
      } else {
        this.newLink.end.x = link.end.x
        this.newLink.end.y = link.end.y
      }
    },
    endAddingLink(audioNode, link) {
      if (!this.isValidLink(audioNode, link)) {
        return
      }
      if (link.start) {
        link.start.audioNode = audioNode
        link.start.x -= audioNode.x
        link.start.y -= audioNode.y
        this.newLink.start = link.start
      } else {
        link.end.audioNode = audioNode
        link.end.x -= audioNode.x
        link.end.y -= audioNode.y
        this.newLink.end = link.end
      }
      this.links.push(this.newLink)
    },
    isValidLink(audioNode, link) {
      if (!this.newLink) {
        return false
      }
      if (link.start && this.newLink.start.audioNode) {
        return false
      }
      if (link.end && this.newLink.end.audioNode) {
        return false
      }
      if (link.start && audioNode === this.newLink.end.audioNode) {
        return false
      }
      if (link.end && audioNode === this.newLink.start.audioNode) {
        return false
      }
      return true
    },
    linkPath(link) {
      let { audioNode: startAudioNode, x: startX, y: startY } = link.start
      let { audioNode: endAudioNode, x: endX, y: endY } = link.end
      if (startAudioNode) {
        startX += startAudioNode.x
        startY += startAudioNode.y
      }
      if (endAudioNode) {
        endX += endAudioNode.x
        endY += endAudioNode.y
      }
      const curveWidth = Math.abs(endX - startX) / 2
      return [
        `M ${startX} ${startY}`,
        [
          `C ${startX + curveWidth} ${startY}`,
          `${endX - curveWidth} ${endY}`,
          `${endX} ${endY}`,
        ].join(', '),
      ].join(' ')
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
  overflow: hidden;
  margin: 0;
  height: 100%;
  background-color: rgba(var(--background), 0.87);
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  user-select: none;
}
#app:focus {
  outline: none;
}
.links {
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
}
.link {
  fill: none;
  stroke: rgba(var(--on-background), 0.5);
}
.link-new {
  stroke: rgb(var(--on-background));
}
</style>
