<template>
  <div class="musicBlock">
    <MiniCover :image="music?.album?.picUrl" :is-curr="false" style="min-width: 50px" @click="play" />
    <div class="info">
      <span class="song">{{ music?.name }}</span>
      <div class="artist">
        <span
          v-for="(item,index) of music?.artist"
          :key="item?.id"
        >
          <span v-artist="item?.id" class="discolour">{{ item?.name }}</span>
          <span v-if="index!==music?.artist.length-1">/</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MiniCover from '@/components/MiniCover.vue'
export default defineComponent({
  name: 'MusicBlock',
  components: {
    MiniCover
  },
  props: {
    music: Object,
    index: Number
  },
  setup(props, ctx) {
    const play = () => {
      ctx.emit('play')
    }
    const openArtist = () => {
      ctx.emit('handleMusicBlock', 1, props.index)
    }
    return {
      play,
      openArtist
    }
  }
})
</script>

<style scoped>
.musicBlock{
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 10px;
}
.musicBlock:hover{
  background: #ececef;
  border-radius: 10px;
}

.info{
  display: flex;
  flex-direction: column;
  margin-left: 15px;
}
.song{
  font-size: 15px;
  font-weight: bold;
  max-width: calc(((var(--block-size) + 20px) * var(--block-num)) / 4 - 90px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.artist{
  max-width: calc(((var(--block-size) + 20px) * var(--block-num)) / 4 - 90px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.icon{
  font-size: 28px;
  color: #1DCF9F;
}
</style>
