<template>
  <div>
    <Player :jump="jump" />
    <ProgressBar2 @jumpTo="jumpTo" />
    <div class="control-bar">
      <div class="bar-left">
        <a-avatar shape="square" :size="50">
          <template #icon><PlayCircleOutlined /></template>
        </a-avatar>
        <span style="margin: 0 10px; font-size: 16px">海阔天空</span>
        <span>--beyond</span>
        <svg-icon
          name="love"
          class="discolour"
          style="font-size: 19px; margin-left: 20px; color: #cccccc"
        />
      </div>
      <div class="bar-center">
        <svg-icon name="loop" class="discolour" style="font-size: 20px" />
        <svg-icon
          name="prev"
          class="discolour prev-button"
          style="font-size: 26px"
        />
        <svg-icon
          :name="state ? 'pause' : 'play'"
          style="font-size: 40px; color: var(--primary-color)"
          @click="changeState"
        />
        <svg-icon
          name="next"
          class="discolour next-button"
          style="font-size: 26px"
        />
        <svg-icon
          name="volume"
          class="discolour"
          style="font-size: 20px"
        />
      </div>
      <div class="bar-right">
        <span style="margin-right: 10px">{{ currFormat }} / {{ totalFormat }}</span>
        <a-button size="small" style="font-size: 14px">
          HQ
          <UpOutlined style="font-size: 10px" />
        </a-button>
        <svg-icon
          name="lyric"
          class="discolour"
          style="font-size: 19px; margin: 0 10px"
        />
        <svg-icon name="music-list" class="discolour" style="font-size: 22px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Player from '@/components/Player.vue'
import ProgressBar2 from '@/components/ProgressBar2.vue'
export default defineComponent({
  name: 'ControlBar',
  components: {
    ProgressBar2,
    Player,
  },
  data() {
    return {
      currFormat: '00:00',
      totalFormat: '00:00',
      jump: 0,
    }
  },
  computed: {
    state() {
      return this.$store.state.audio.state
    },
    currentDura() {
      return this.$store.state.audio.currentTime
    },
    totalDura() {
      return this.$store.state.audio.duration
    },
  },
  watch: {
    currentDura() {
      this.currFormat = this.timeFormat(this.currentDura)
    },
    totalDura() {
      this.totalFormat = this.timeFormat(this.totalDura)
    },
  },
  methods: {
    changeState(): void {
      const param = { prop: 'state', value: !this.state }
      this.$store.commit('setAudio', param)
    },
    jumpTo(value) {
      this.jump = value
    },
    timeFormat(time) {
      const timeM = time / 60
      const timeS = time % 60
      let timeMinute: string = ''
      let timeSeconds: string = ''
      if (timeM < 10) {
        timeMinute = `0${timeM}`
      } else {
        timeMinute = `${timeM}`
      }
      if (timeS < 10) {
        timeSeconds = `0${timeS}`
      } else {
        timeSeconds = `${timeS}`
      }
      timeMinute = timeMinute.substr(0, 2)
      timeSeconds = timeSeconds.substr(0, 2)
      return `${timeMinute}:${timeSeconds}`
    },
  },
})
</script>

<style scoped>
.control-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.bar-left {
  width: 25%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.bar-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.bar-right {
  width: 25%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.discolour {
  color: rgb(102, 102, 102);
}

.discolour:hover {
  color: var(--primary-color);
}

.prev-button {
  color: #3f3f3f;
  margin: 0 20px 0 30px;
}

.next-button {
  color: #3f3f3f;
  margin: 0 30px 0 20px;
}
</style>
