<template>
  <div class="play-item" :style="{background: musicId===listItem?.id?'rgba(236, 236, 236, 0.53)':''}">
    <div style="display: flex;min-width: 45%;max-width: 45%;">
      <MiniCover :image="listItem?.album?.picUrl" :is-curr="musicId===listItem?.id" />
      <div class="main">
        <span class="music-name">{{ listItem?.name }}</span>
        <div>
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
      <span class="discolour">{{ listItem?.album?.name }}</span>
    </div>
    <span class="time"><svg-icon name="love" class="love"/>{{ timeFormat(listItem?.duration) }}</span>
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
</style>
