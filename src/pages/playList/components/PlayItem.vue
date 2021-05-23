<template>
  <div class="play-item" :style="{background: musicId===listItem?.id?'rgba(236, 236, 236, 0.53)':''}">
    <div style="display: flex;min-width: 45%;max-width: 45%;">
      <MiniCover :image="listItem?.album?.picUrl" :isCurr="musicId===listItem?.id" />
      <div class="main">
        <span class="music-name">{{ listItem?.name }}</span>
        <div class="artists">
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
    <span class="album discolour">{{ listItem?.album?.name }}</span>
    <span class="time">{{ timeFormat(listItem?.duration) }}</span>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
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
    const musicId = computed(() => store.state.musicList[store.state.currIndex])
    return {
      musicId,
      timeFormat
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
.artists{
  font-size: 14px;
}
.album{
  min-width: 45%;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
</style>
