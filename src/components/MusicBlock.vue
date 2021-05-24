<template>
  <div v-if="data.id!==undefined" class="musicBlock">
    <Block :image="data.picUrl" @click="onPlay" />
    <div class="info">
      <span class="song">{{ data.name }}</span>
      <!--      <div style="display: flex;align-items: center">-->
      <!--        <svg-icon class="icon" name="SQ" />-->
      <div class="artists">
        <span
          v-for="(item,index) of data.song.artists"
          :key="item.id"
        >
          <span class="discolour">{{ item?.name }}</span>
          <span v-if="index!==data.song.artists.length-1">/</span>
        </span>
      </div>
      <!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Block from '@/components/MiniCover.vue'
export default defineComponent({
  name: 'MusicBlock',
  components: {
    Block
  },
  props: {
    song: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      data: {}
    }
  },
  created() {
    if (this.song) {
      this.data = this.song
    }
  },
  methods: {
    onPlay() {
      this.$emit('play')
    },
    clickSong() {
      this.$emit('handleMusicBlock', 0, this.index)
    },
    clickArt() {
      this.$emit('handleMusicBlock', 1, this.index)
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
}

.icon{
  font-size: 28px;
  color: #1DCF9F;
}
</style>
