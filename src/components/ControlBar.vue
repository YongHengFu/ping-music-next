<template>
  <div>
    <Player ref="player" />
    <ProgressBar2 origin-key="controlBar" @jumpTo="jumpTo" />
    <div class="control-bar">
      <div class="bar-left">
        <div style="position: relative" class="cover" @click="showPlayView">
          <img
            class="cover-image"
            :src="imgUrl"
          >
          <div class="cover-mask">
            <svg-icon name="upShow" style="width: 100%;height: 100%;padding: 30%" />
          </div>
        </div>

        <div style="display: flex;flex-direction: column;margin-left: 10px">
          <div>
            <span style="font-size: 18px;font-weight: bolder">
              {{ currMusic?.name??'Ping音乐' }}</span>
            <svg-icon
              v-if="currMusic"
              name="love"
              class="discolour"
              style="font-size: 18px; margin-left: 20px; color: #cccccc"
            />
          </div>

          <div>
            <span v-if="!currMusic">FuYH</span>
            <template v-else>
              <span
                v-for="(item,index) of currMusic?.artist"
                :key="item.id"
                class="discolour"
                style="font-size: 14px;cursor: pointer"
              >{{ item?.name }}{{ index===currMusic?.artist.length-1? '' : '/' }}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="bar-center">
        <div>
          <svg-icon
            :name="modeList[mode]"
            class="discolour"
            style="font-size: 20px;"
            @click="switchMode"
          />
        </div>
        <svg-icon
          name="prev"
          class="discolour prev-button"
          style="font-size: 22px"
          @click="prev"
        />
        <svg-icon
          :name="state ? 'pause' : 'play'"
          style="font-size: 40px; color: var(--primary-color)"
          @click="changeState"
        />
        <svg-icon
          name="next"
          class="discolour next-button"
          style="font-size: 22px"
          @click="next"
        />
        <div class="volume">
          <svg-icon
            :name="mute?'volume_mute':'volume'"
            class="discolour"
            style="font-size: 20px"
            @click="volumeMute"
          />
          <VolumeBar v-show="!mute" class="volumeBar" origin-key="controlBar" />
        </div>
      </div>
      <div class="bar-right">
        <span style="margin-right: 10px">{{ currFormat }} / {{ totalFormat }}</span>
        <svg-icon
          name="lyric"
          class="discolour"
          style="font-size: 19px; margin: 0 10px"
        />
        <svg-icon name="music-list" class="discolour" style="font-size: 22px" @click="showDrawer" />
        <span style="font-size: 14px">{{ detailList.length }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import Player from '@/components/Player.vue'
import ProgressBar2 from '@/components/ProgressBar2.vue'
import VolumeBar from '@/components/VolumeBar.vue'
import coverImage from '@/assets/image/cover.png'
export default defineComponent({
  name: 'ControlBar',
  components: {
    ProgressBar2,
    Player,
    VolumeBar
  },
  setup(props, ctx) {
    const store = useStore()
    const currFormat = ref('00:00')
    const totalFormat = ref('00:00')
    const jump = ref(0)
    const modeList = ['order', 'loop', 'random', 'single']
    const imgUrl = ref(coverImage)

    const state = computed(() => store.state.audio.state)
    const currentDura = computed(() => store.state.audio.currentTime)
    const totalDura = computed(() => store.state.audio.duration)
    const mode = computed(() => store.state.audio.mode)
    const mute = computed(() => store.state.audio.mute)
    const detailList = computed(() => store.state.detailList)
    const currIndex = computed(() => store.state.currIndex)
    const currMusic = computed(() => detailList.value[currIndex.value])

    watch(mute, () => {
      console.log(mute.value)
    })

    watch(currentDura, () => {
      currFormat.value = timeFormat(currentDura.value)
    })

    watch(totalDura, () => {
      totalFormat.value = timeFormat(totalDura.value)
    })

    watch(currMusic, () => {
      imgUrl.value = currMusic.value?.album?.picUrl + '?param=300y300'
    })

    const showPlayView = () => {
      store.commit('setShowPlayView', true)
    }
    const switchMode = () => {
      let param = {}
      if (mode.value !== modeList.length - 1) {
        param = { prop: 'mode', value: mode.value + 1 }
      } else {
        param = { prop: 'mode', value: 0 }
      }
      store.commit('setAudio', param)
    }
    const changeState = () => {
      const param = { prop: 'state', value: !state.value }
      store.commit('setAudio', param)
    }
    const jumpTo = (value) => {
      jump.value = value
    }
    const timeFormat = (time) => {
      const timeM = time / 60
      const timeS = time % 60
      let timeMinute = ''
      let timeSeconds = ''
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
    }
    const volumeMute = () => {
      const param = { prop: 'mute', value: !mute.value }
      store.commit('setAudio', param)
    }
    const prev = () => {
      const param = { prop: 'prev', value: true }
      store.commit('setAudio', param)
    }
    const next = () => {
      const param = { prop: 'next', value: true }
      store.commit('setAudio', param)
    }
    const showDrawer = () => {
      ctx.emit('showDrawer')
    }

    return {
      imgUrl,
      currMusic,
      modeList,
      mode,
      mute,
      jump,
      detailList,
      currFormat,
      totalFormat,
      showPlayView,
      changeState,
      switchMode,
      jumpTo,
      volumeMute,
      prev,
      next,
      showDrawer
    }
  }
/*  data() {
    return {
      coverImage: coverImage,
      currFormat: '00:00',
      totalFormat: '00:00',
      jump: 0,
      isVolumeBar: false,
      modeList: ['order', 'loop', 'random', 'single']
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
    mode() {
      return this.$store.state.audio.mode
    },
    mute() {
      return this.$store.state.audio.mute
    },
    detailList() {
      return this.$store.state.detailList
    },
    currIndex() {
      return this.$store.state.currIndex
    },
    currMusic() {
      return this.detailList[this.currIndex]
    }
  },
  watch: {
    currentDura() {
      this.currFormat = this.timeFormat(this.currentDura)
    },
    totalDura() {
      this.totalFormat = this.timeFormat(this.totalDura)
    }
  },
  methods: {
    showPlayView() {
      this.$store.commit('setShowPlayView', true)
    },
    switchMode() {
      let param = {}
      if (this.mode !== this.modeList.length - 1) {
        param = { prop: 'mode', value: this.mode + 1 }
      } else {
        param = { prop: 'mode', value: 0 }
      }
      this.$store.commit('setAudio', param)
    },
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
    volumeMute() {
      const param = { prop: 'mute', value: !this.$store.state.audio.mute }
      this.$store.commit('setAudio', param)
    },
    prev() {
      const param = { prop: 'prev', value: true }
      this.$store.commit('setAudio', param)
    },
    next() {
      const param = { prop: 'next', value: true }
      this.$store.commit('setAudio', param)
    },
    showDrawer() {
      this.$emit('showDrawer')
    }
  }*/
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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.bar-center {
  width: 250px;
  min-width: 250px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.bar-right {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.cover{
  border: 1px solid #ededed;
  overflow: hidden;
}
.cover-image{
  width: 50px;
  height: 50px;
  transition: 0.3s;
  /*border-radius: 2px;*/
}
.cover-mask{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0.8;
  /*background: #fafafa;*/
  color: #FFFFFF;
  transition: 0.3s;
  opacity: 0;
}
.cover:hover .cover-image{
  filter: blur(3px);
}
.cover:hover .cover-mask{
  opacity: 1;
}

.prev-button {
  color: #3f3f3f;
  margin: 0 20px 0 30px;
}

.next-button {
  color: #3f3f3f;
  margin: 0 30px 0 20px;
}
.volume{
  /*width: 150px;*/
  /*display: flex;*/
  /*align-items: center;*/
  position: relative;
}
.volumeBar{
  width: 0;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  transition: 0.3s;
}
.volume:hover .volumeBar{
  width: 100px;
}
.discolour {
  color: rgb(102, 102, 102);
}
.discolour:hover {
  color: var(--primary-color);
}
</style>
