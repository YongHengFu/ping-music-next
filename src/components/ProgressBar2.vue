<template>
  <Player :jump="jump" />
  <div class="progress-bar">
    <div class="duration" />
    <div class="buffered" />
    <div class="currentTime" :style="'right:'+currFormat" />
    <div
      class="point"
      :style="'right:'+currFormat"
      @mousedown="mousedown($event)"
      @mousemove="mousemove($event)"
      @mouseup="mouseup($event)"
    />
    <p v-show="false">{{ currentDura }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Player from '@/components/Player.vue'
export default defineComponent({
  name: 'ProgressBar2',
  components: {
    Player,
  },
  data() {
    return {
      // buffStyle: { right: '20%' },
      // currStyle: { right: '50%' },
      // pointStyle: { right: '50%' },
      oldX: 0,
      newX: 0,
      jump: 0,
      mouseDown: false,
    }
  },
  computed: {
    currentDura() {
      // this.currStyle.right = (1 - (this.$store.state.audio.currentTime / this.totalDura)) * 100 + ''
      // this.currStyle.right = this.currStyle.right.substr(0, 4) + '%'
      // console.log(this.currStyle.right)
      // this.progress[0] = this.$store.state.audio.currentTime
      return this.$store.state.audio.currentTime
    },
    totalDura() {
      return this.$store.state.audio.duration
    },
    currFormat(): string {
      return ((1 - (this.currentDura / this.totalDura)) * 100 + '').substr(0, 4) + '%'
    },
  },
  methods: {
    mousedown(e) {
      this.mouseDown = true
      this.oldX = e.x
      console.log(this.oldX)
      if (this.mouseDown) {
        window.addEventListener('mousemove', function(el) {
          console.log(el.x)
        })
      }
    },
    mousemove(e) {
      // this.newX = e.x
      // console.log(this.newX)
    },
    mouseup(e) {
      this.mouseDown = false
    },
  },
})
</script>

<style scoped>
.progress-bar{
  margin: 0 2px;
  height: 5px;
  position: relative;
  background: #2f54eb;
  z-index: 0;
  margin-bottom: 10px;
}
.duration{
  height: 5px;
  background: #cccccc;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
}
.buffered{
  height: 5px;
  background: #999999;
  position: absolute;
  left: 0;
  right: 20%;
  z-index: 2;
}
.currentTime{
  background: var(--primary-color);
  height: 5px;
  position: absolute;
  left: 0;
  right: 50%;
  z-index: 4;
}
.point{
  cursor: pointer;
  width: 15px;
  height: 15px;
  border: var(--primary-color) solid 2px;
  border-radius: 50%;
  background: #FFFFFF;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateY(-50%);
  z-index: 5;
}
</style>
