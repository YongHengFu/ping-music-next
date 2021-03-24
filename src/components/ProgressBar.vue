<template>
  <div>
    <Player :jump="jump" />
    <a-slider
      v-model:value="progress[index]"
      :min="0"
      :max="totalDura"
      :step="1"
      :tip-formatter="sliderFormat"
      @beforeChange="mousedown"
      @afterChange="mouseup"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Player from '@/components/Player.vue'
export default defineComponent({
  name: 'ProgressBar',
  components: {
    Player,
  },
  data() {
    return {
      progress: [0, 0],
      index: 0,
      time: 0,
      jump: 0,
    }
  },
  computed: {
    currentDura() {
      this.progress[0] = this.$store.state.audio.currentTime
      return this.$store.state.audio.currentTime
    },
    totalDura() {
      return this.$store.state.audio.duration
    },
    currFormat(): string {
      const currM = this.currentDura / 60
      const currS = this.currentDura % 60
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
  methods: {
    sliderFormat(): string {
      // return ''
      return this.currFormat
      /* const currM = this.progress[this.index] / 60
      const currS = this.progress[this.index] % 60
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

      return `${currMinute}:${currSeconds}`*/
    },
    mousedown(value) {
      this.progress[1] = value
      this.index = 1
      console.log('down')
    },
    mouseup(value) {
      this.jump = value
      this.index = 0
      this.progress[1] = value
      console.log('up')
    },
  },
})
</script>

<style scoped>

</style>
