<template>
  <div class="control-bar">
    <div class="info">
      <div class="text">
        <span class="music-name">{{ currMusic?.name??'Ping音乐' }}</span>
        <span v-if="!currMusic" style="color: #cccccc">FuYH</span>
        <div v-else class="artist">
          <span
            v-for="(item,index) of currMusic?.artist"
            :key="item.id"
          >
            <span v-artist="item?.id" class="discolour text-color">{{ item?.name }}</span>
            <span v-if="index!==currMusic.artist.length-1"> / </span>
          </span>
          <span> - </span>
          <span v-album="currMusic?.album?.id" class="discolour text-color">{{ currMusic?.album?.name }}</span>
        </div>
        <!--        <div v-else>
          <span
            v-for="(item,index) of currMusic?.artist"
            :key="item.id"
            class="discolour"
            style="color: #FFFFFF"
          >{{ item.name }}{{ index===currMusic?.artist.length-1? '' : '/' }}</span>
        </div>-->
      </div>
      <svg-icon
        name="love"
        :class="likeList.indexOf(currMusic?.id)!==-1?'like-active':'like'"
        @click="setLike"
      />
    </div>
    <div style="width: 100%;display: flex;align-items: center;color: #FFFFFF">
      <span>{{ currFormat }}</span>
      <ProgressBar origin-key="playView" style="width: 100%;margin: 0 10px" />
      <span>{{ totalFormat }}</span>
    </div>
    <div class="control">
      <div>
        <svg-icon
          :name="modeList[mode]"
          class="discolour"
          style="font-size: 20px;color: #FFFFFF"
          @click="switchMode"
        />
      </div>
      <svg-icon
        name="prev"
        class="discolour prev-button"
        style="font-size: 26px"
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
        style="font-size: 26px"
        @click="next"
      />
      <div class="volume">
        <svg-icon
          :name="mute?'volume_mute':'volume'"
          class="discolour"
          style="font-size: 20px;color: #FFFFFF"
          @click="volumeMute"
        />
        <VolumeBar v-show="!mute" class="volumeBar" origin-key="playView" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import ProgressBar from '@/components/ProgressBar.vue'
import VolumeBar from '@/components/VolumeBar.vue'
import timeFormat from '@/utils/timeFormat'
import { likeMusic } from '@/api/music'
export default defineComponent({
  name: 'ControlBarMini',
  components: {
    ProgressBar,
    VolumeBar
  },
  setup() {
    const store = useStore()
    const currFormat = ref('00:00')
    const totalFormat = ref('00:00')
    const jump = ref(0)
    const modeList = ['order', 'loop', 'random', 'single']

    const state = computed(() => store.state.audio.state)
    const currentDura = computed(() => store.state.audio.currentTime)
    const totalDura = computed(() => store.state.audio.duration)
    const mode = computed(() => store.state.audio.mode)
    const mute = computed(() => store.state.audio.mute)
    const currMusic = computed(() => store.state.currMusic)
    const likeList = computed(() => store.state.likeList)

    watch(currentDura, () => {
      currFormat.value = timeFormat(currentDura.value)
    })

    watch(totalDura, () => {
      totalFormat.value = timeFormat(totalDura.value)
    })

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
    const jumpTo = (value:number) => {
      jump.value = value
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

    const setLike = () => {
      const param = {
        id: currMusic.value?.id,
        like: false
      }
      const index = likeList.value.indexOf(currMusic.value?.id)
      if (index === -1) {
        param.like = true
      }
      likeMusic(param).then((res:any) => {
        if (res.code === 200) {
          const ids:any = [].concat(likeList.value)
          if (index === -1) {
            ids.push(param.id)
          } else {
            ids.splice(index, 1)
          }
          store.commit('setLikeList', ids)
        }
      })
    }

    return {
      state,
      currMusic,
      modeList,
      mode,
      mute,
      jump,
      currFormat,
      totalFormat,
      likeList,
      changeState,
      switchMode,
      jumpTo,
      volumeMute,
      prev,
      next,
      setLike
    }
  }
})
</script>

<style scoped>

.control-bar{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.info{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.text{
  max-width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.music-name{
  width: 100%;
  font-size: 18px;
  font-weight: bolder;
  color: #FFFFFF;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.artist{
  width: 100%;
  color: #FFFFFF;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.text-color{
  color: #FFFFFF;
}
.like{
  min-width: 10%;
  margin-right: 5px;
  color: #FFFFFF;
  cursor: pointer;
}
.like:hover{
  color: var(--primary-color);
}
.like-active{
  min-width: 10%;
  margin-right: 5px;
  color: red;
  cursor: pointer;
}
.control{
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.prev-button {
  color: #FFFFFF;
  margin: 0 20px 0 30px;
}

.next-button {
  color: #FFFFFF;
  margin: 0 30px 0 20px;
}
.volume{
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
</style>
