<template>
  <div class="album-item">
    <div style="display: flex;align-items: center">
      <span class="index">{{ index+1 }}<svg-icon name="play-fill" class="play-fill discolour" /></span>
      <span :class="!music?.canPlay?.able?'invalid':'music-name'">{{ music.name }}</span>
    </div>
    <span class="time">
      <svg-icon v-if="music?.canPlay?.type!==2" name="love" :class="likeList.indexOf(music?.id)!==-1?'like-active':'like'" @click="setLike"/>
      {{ timeFormat(music.duration) }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import timeFormat from '@/utils/timeFormat'
import { likeMusic } from '@/api/music'
export default defineComponent({
  name: 'AlbumItem',
  props: {
    music: Object,
    index: Number
  },
  setup(props) {
    const store = useStore()
    const likeList = computed(() => store.state.likeList)
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
  background: #f2f2f2;
}
.index{
  font-size: 18px;
  color: #aaaaaa;
  position: relative;
  display: inline-block;
  text-align: center;
  min-width: 50px;
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
