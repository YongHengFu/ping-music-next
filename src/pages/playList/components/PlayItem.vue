<template>
  <div class="play-item" :style="{background: musicId===listItem?.id?'rgba(236, 236, 236, 0.53)':''}">
    <div style="display: flex;min-width: 45%;max-width: 45%;">
      <MiniCover :image="listItem?.album?.picUrl" :is-curr="musicId===listItem?.id" style="min-width: 50px"/>
      <div class="main">
        <span :class="!listItem?.canPlay?.able?'invalid':'music-name'">{{ listItem?.name }}</span>
        <div class="artist">
          <span
            v-for="(item,index) of listItem?.artist"
            :key="item.id"
          >
            <span class="discolour">{{ item?.name }}</span>
            <span v-if="index!==listItem.artist.length-1">/</span>
          </span>
        </div>
      </div>
    </div>
    <div class="album">
      <span class="discolour" @click="openAlbum(listItem.album.id)">{{ listItem?.album?.name }}</span>
    </div>
    <span class="time"><svg-icon name="love" class="love" />{{ timeFormat(listItem?.duration) }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MiniCover from '@/components/MiniCover.vue'
import timeFormat from '@/utils/timeFormat'
export default defineComponent({
  name: 'PlayItem',
  components: {
    MiniCover
  },
  props: {
    listItem: Array
  },
  setup(props, ctx) {
    const store = useStore()
    const router = useRouter()
    const musicId = computed(() => store.state.currMusic?.id)
    const openAlbum = (id:string) => {
      router.push('/album/' + id)
    }
    return {
      musicId,
      timeFormat,
      openAlbum
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
.love{
  margin-right: 20px;
  color: #cccccc;
  visibility: hidden;
}
.play-item:hover .love{
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
