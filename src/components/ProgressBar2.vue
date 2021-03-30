<template>
  <div
    id="progress-bar"
    class="progress-bar"
    @click="jumpPoint($event)"
    @mouseenter="isPoint=true"
    @mouseleave="isPoint=false"
  >
    <div class="duration" />
    <div class="buffered" :style="`right: ${(1- buffDura / totalDura) * 100}%`" />
    <div class="currentTime" :style="currStyle" />
    <a-tooltip placement="top" :title="sliderFormat" :arrow-point-at-center="true">
      <div
        v-show="!state||isPoint"
        class="point"
        :style="currStyle"
        @mousedown="mousedown($event)"
        @mouseup="mouseup($event)"
        @mouseenter="isTip=true"
        @mouseleave="isTip=false"
      >
        <!--      <span v-if="!state||isTip" class="tip" id="tipText">{{ sliderFormat }}</span>-->
      </div>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProgressBar2',
  components: {

  },
  data() {
    return {
      buffStyle: '',
      currStyle: '',
      oldX: 0,
      // jump: 0,
      move: 50,
      state: true,
      tipTime: 0,
      isPoint: false,
      isTip: false
    }
  },
  computed: {
    currentDura() {
      return this.$store.state.audio.currentTime
    },
    totalDura() {
      return this.$store.state.audio.duration
    },
    buffDura() {
      return this.$store.state.audio.buffered
    },
    currFormat() {
      return ((1 - (this.currentDura / this.totalDura)) * 100)
    },
    sliderFormat(): string {
      const currM = this.tipTime / 60
      const currS = this.tipTime % 60
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
    }
  },
  watch: {
    currFormat() {
      if (this.state) {
        this.move = this.currFormat
        this.tipTime = this.currentDura
        this.currStyle = `right: ${this.move}%`
      }
    }
    // buffDura() {
    //   this.buffStyle = `right: ${(1 - this.buffDura / this.totalDura) * 100}%`
    // },
  },
  mounted() {

  },
  methods: {
    jumpPoint(e) {
      const pro = document.getElementById('progress-bar')
      const width = pro.offsetWidth
      const X = pro.offsetLeft
      this.$emit('jumpTo', ((e.x - X) / width) * this.totalDura)
      // this.jump = ((e.x - X) / width) * this.totalDura
    },
    mousedown(e) {
      this.state = false
      this.oldX = e.x
      const this_ = this
      function move(el) {
        const pro = document.getElementById('progress-bar')
        const width = pro.offsetWidth
        const X = pro.offsetLeft
        let moveWidth = (1 - ((el.x - X) / width)) < 0 ? 0 : (1 - ((el.x - X) / width))
        moveWidth = (1 - ((el.x - X) / width)) > 1 ? 1 : moveWidth
        this_.currStyle = `right: ${moveWidth * 100}%`
        this_.tipTime = (1 - moveWidth) * this_.totalDura
      }
      window.addEventListener('mousemove', move, false)

      window.addEventListener('mouseup', async function(el) {
        await window.removeEventListener('mousemove', move, false)
        if (!this_.state) {
          // const pro = document.getElementById('progress-bar')
          // const width = pro.offsetWidth
          // const X = pro.offsetLeft
          // const width = document.getElementById('progress-bar').offsetWidth
          // const moveWidth = this_.move - ((el.x - this_.oldX) / width) * 100
          // this_.tipTime = (1 - (moveWidth / 100)) * this_.totalDura
          this_.state = true
          this_.$emit('jumpTo', this_.tipTime)
          // this_.jump = this_.tipTime
        }
      }, false)
    },
    mouseup(e) {
      // console.log(this.mouseDown)
    }
  }
})
</script>

<style scoped>
.progress-bar{
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 5px;
  height: 12px;
  position: relative;
  z-index: 0;
  padding: 0;
}
.duration{
  height: 3px;
  background: #cccccc;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
}
.buffered{
  height: 3px;
  background: #999999;
  position: absolute;
  left: 0;
  right: 20%;
  z-index: 2;
}
.currentTime{
  background: var(--primary-color);
  height: 3px;
  /*box-shadow: 0 0px 5px var(--primary-color);*/
  box-shadow:10px 0 20px -10px blue;
  position: absolute;
  left: 0;
  right: 100%;
  z-index: 4;
}
 .point{
  cursor: pointer;
  width: 12px;
  height: 12px;
  border: var(--primary-color) solid 1px;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 0 0 10px var(--primary-color);
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translate(50%,-50%);
  z-index: 5;
  animation: point-shadow 1.5s infinite alternate-reverse;
}
@keyframes  point-shadow {
  0% {
    box-shadow: 0 0 1px var(--primary-color);
  }
  50% {
    box-shadow: 0 0 5px 2px var(--primary-color);
  }
  100% {
    box-shadow: 0 0 10px 3px var(--primary-color);
  }
}
.tip {
  background-color: black;
  color: #fffFFF;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  opacity: 0.8;
  position: absolute;
  left: 50%;
  top: -40px;
  transform: translateX(-50%);
  z-index: 6;
}
</style>
