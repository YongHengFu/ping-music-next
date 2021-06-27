<template>
  <div class="album-item" :style="(musicId===music?.id&&listId===currListId)?'background: rgba(236, 236, 236, 0.53)':''">
    <div style="display: flex;align-items: center;min-width: 50%;max-width: 50%;">
      <div v-if="musicId===music?.id&&listId===currListId" class="play-animation">
        <lottie-player
          ref="player"
          autoplay
          loop
          mode="bounce"
          :src="playAnimation"
          style="width: 50px;height: 30px"
        />
      </div>
      <span v-else class="index">{{ index+1 }}
        <svg-icon name="play-fill" class="play-fill discolour" @click="playSelect" />
      </span>
      <span :class="!music?.canPlay?.able?'invalid':'music-name'">{{ music.name }}</span>
    </div>
    <div class="artist">
      <span
        v-for="(item,index) of music?.artist"
        :key="item.id"
      >
        <span v-artist="item?.id" class="discolour">{{ item?.name }}</span>
        <span v-if="index!==music.artist.length-1"> / </span>
      </span>
    </div>
    <span class="time">
      <svg-icon v-if="music?.canPlay?.type!==2" name="love" :class="likeList.indexOf(music?.id)!==-1?'like-active':'like'" @click="setLike" />
      {{ timeFormat(music.duration) }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref } from 'vue'
import { useStore } from 'vuex'
import timeFormat from '@/utils/timeFormat'
import { likeMusic } from '@/api/music'
import playAnimation from '@/assets/lottie/sonicWave.json'
export default defineComponent({
  name: 'AlbumItem',
  props: {
    music: Object,
    index: Number,
    listId: String
  },
  setup(props, ctx) {
    const store = useStore()
    const player = ref()
    const likeList = computed(() => store.state.likeList)
    const musicId = computed(() => store.state.currMusic?.id)
    const currListId = computed(() => store.state.currMusic?.listId)
    const state = computed(() => store.state.audio.state)

    watch(state, () => {
      if (props.listId === musicId.value) {
        if (state.value) {
          player.value?.play()
        } else {
          player.value?.pause()
        }
      }
    })

    const playSelect = () => {
      ctx.emit('playSelect')
    }

    const setLike = () => {
      const param = {
        id: props.music?.id,
        like: false
      }
      const index = likeList.value.indexOf(props.music?.id)
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
      likeList,
      musicId,
      currListId,
      playAnimation,
      player,
      playSelect,
      timeFormat,
      setLike
    }
  }
})
</script>

<style scoped>
.album-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  user-select: none;
}
.album-item:hover{
  background: rgba(236, 236, 236, 0.53);
}
.index{
  font-size: 18px;
  color: #aaaaaa;
  position: relative;
  display: inline-block;
  text-align: center;
  min-width: 50px;
  min-height: 30px;
}
.play-fill{
  color: #1a1a1a;
  visibility: hidden;
  cursor: pointer;
  width: 50%;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #f2f2f2;
  transition: width 0.1s, height 0.1s;
}
.album-item:hover .play-fill{
  visibility: visible;
  width: 100%;
  height: 100%;
}
.album-item:hover .like{
  visibility: visible;
}
.music-name{
  font-size: 18px;
  font-weight: bolder;
}
.artist{
  min-width: 40%;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.like{
  cursor: pointer;
  margin-right: 30px;
  color: #cccccc;
  visibility: hidden;
}
.like:hover{
  color: var(--primary-color);
}
.like-active{
  cursor: pointer;
  margin-right: 30px;
  color: red;
}
.invalid{
  font-size: 18px;
  font-weight: bolder;
  color: #e2e2e2;
}
</style>
