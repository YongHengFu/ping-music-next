<template>
  <Player :jump="jump" />
  <div id="progress-bar" class="progress-bar">
    <div class="duration" />
    <div class="buffered" />
    <div class="currentTime" :style="currStyle" />
    <div
      class="point"
      :style="currStyle"
      @mousedown="mousedown($event)"
      @mouseup="mouseup($event)"
    >
      <span class="tip">{{ sliderFormat }}</span>
    </div>
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
      currStyle: '',
      oldX: 0,
      newX: 0,
      jump: 0,
      barWidth: 0,
      move: 50,
      state: true,
      tip: 0,
    }
  },
  computed: {
    currentDura() {
      return this.$store.state.audio.currentTime
    },
    totalDura() {
      return this.$store.state.audio.duration
    },
    currFormat() {
      return ((1 - (this.currentDura / this.totalDura)) * 100)
    },
    sliderFormat(): string {
      const currM = this.tip / 60
      const currS = this.tip % 60
      let currMinute: string = ''
      let currSeconds: string = ''
      if (currM < 10) {
        currMinute = `0${currM}`
      } else {
        currMinute = `${currM}`
      }
      if (currS < 10) {
        currSeconds = `0${currS}`
      } else {
        currSeconds = `${currS}`
      }

      currMinute = currMinute.substr(0, 2)
      currSeconds = currSeconds.substr(0, 2)

      return `${currMinute}:${currSeconds}`
    },
  },
  watch: {
    currFormat() {
      if (this.state) {
        this.move = this.currFormat
        this.tip = this.currentDura
        this.currStyle = `right: ${this.move}%`
      }
    },
  },
  mounted() {

  },
  methods: {
    mousedown(e) {
      this.state = false
      this.oldX = e.x
      const this_ = this
      function move(el) {
        const width = document.getElementById('progress-bar').offsetWidth
        const moveWidth = this_.move - ((el.x - this_.oldX) / width) * 100
        moveWidth < 0 ? 0 : moveWidth
        moveWidth > 100 ? 100 : moveWidth
        if (moveWidth >= 0 && moveWidth <= 100) {
          this_.currStyle = `right: ${moveWidth}%`
          this_.tip = (1 - (moveWidth / 100)) * this_.totalDura
        }
      }
      window.addEventListener('mousemove', move, false)

      window.addEventListener('mouseup', function(el) {
        if (!this_.state) {
          const width = document.getElementById('progress-bar').offsetWidth
          const moveWidth = this_.move - ((el.x - this_.oldX) / width) * 100
          this_.tip = (1 - (moveWidth / 100)) * this_.totalDura
          this_.jump = this_.tip
          this_.state = true
        }
        window.removeEventListener('mousemove', move, false)
      }, false)
    },
    mouseup(e) {
      // console.log(this.mouseDown)
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
  right: 100%;
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
  right: 100%;
  transform: translateY(-50%);
  z-index: 5;
}
.tip {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;

  /* 定位 */
  position: absolute;
  left: 50%;
  top: -40px;
  transform: translateX(-50%);
  z-index: 6;
}

.point:hover .tip {
  visibility: visible;
}
</style>
