<template>
  <div class="play-item" :style="{background: (musicId===listItem?.id&&listId===currListId)?'rgba(236, 236, 236, 0.53)':''}">
    <div style="display: flex;min-width: 45%;max-width: 45%;">
      <MiniCover
        :image="listItem?.album?.picUrl"
        :is-curr="musicId===listItem?.id&&listId===currListId"
        style="min-width: 50px"
        @click="playSelect"
      />
      <div class="main">
        <span :class="!listItem?.canPlay?.able?'invalid':'music-name'">{{ listItem?.name }}</span>
        <div class="artist">
          <span
            v-for="(item,index) of listItem?.artist"
            :key="item.id"
          >
            <span v-artist="item?.id" class="discolour">{{ item?.name }}</span>
            <span v-if="index!==listItem.artist.length-1">/</span>
          </span>
        </div>
      </div>
    </div>
    <div class="album">
      <span v-album="listItem?.album?.id" class="discolour" @click="openAlbum(listItem?.album?.id)">{{ listItem?.album?.name }}</span>
    </div>
    <span class="time">
      <svg-icon v-if="listItem?.canPlay?.type!==2" name="love" :class="likeList.indexOf(listItem?.id)!==-1?'like-active':'like'" @click="setLike" />
      {{ timeFormat(listItem?.duration) }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MiniCover from '@/components/MiniCover.vue'
import timeFormat from '@/utils/timeFormat'
import { likeMusic } from '@/api/music'
export default defineComponent({
  name: 'PlayItem',
  components: {
    MiniCover
  },
  props: {
    listItem: Array,
    listId: String
  },
  setup(props, ctx) {
    const store = useStore()
    const router = useRouter()
    const musicId = computed(() => store.state.currMusic?.id)
    const currListId = computed(() => store.state.currMusic?.listId)
    const likeList = computed(() => store.state.likeList)

    watch(musicId, () => {
      if (musicId.value === props?.listItem?.id && props?.listId === currListId.value) {
        ctx.emit('isCurr', true)
      } else {
        ctx.emit('isCurr', false)
      }
    })

    const openAlbum = (id:string) => {
      router.push('/album/' + id)
    }

    const playSelect = () => {
      ctx.emit('playSelect')
    }

    const setLike = () => {
      const param = {
        id: props.listItem?.id,
        like: false
      }
      const index = likeList.value.indexOf(props.listItem?.id)
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
      musicId,
      likeList,
      currListId,
      playSelect,
      timeFormat,
      openAlbum,
      setLike
    }
  }
})
</script>

<style scoped>
.play-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  user-select: none;
}
.play-item:hover{
  background: rgba(236, 236, 236, 0.53);
}
.main{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  margin-left: 15px;
}
.music-name{
  font-size: 16px;
  font-weight: bolder;
}
.album{
  min-width: 45%;
  max-width: 45%;
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
  visibility: visible;
  color: red;
}
.play-item:hover .like{
  visibility: visible;
}
.artist{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.invalid{
  font-size: 16px;
  font-weight: bolder;
  color: #e2e2e2;
}
</style>
