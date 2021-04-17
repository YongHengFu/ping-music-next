<template>
  <div v-if="data.id!==undefined" class="musicBlock">
    <div class="cover" @click="clickSong">
      <a-avatar shape="square" :size="60" :src="data.picUrl" />
      <svg-icon class="play-icon" name="play-fill" />
    </div>
    <div class="info">
      <span class="song">{{ data.name }}</span>
      <svg-icon class="icon" name="SQ" />
      <div class="artists" @click="clickArt">
        <span
          v-for="(item,index) of data.song.artists"
          :key="item.id"
        >{{ index===data.song.artists.length-1?item.name : item.name+'/' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MusicBlock',
  components: {

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
  position: relative;
  height: 60px;
  /*width: 30%;*/
  margin-right: 10px;
}
.musicBlock:hover{
  background: #e2e2e2;
  border-radius: 5px;
}
.cover{
  width: 60px;
  height: 60px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.play-icon{
  color: var(--primary-color);
  background: rgba(255,255,255,0.95);
  /*filter: blur(1px);*/
  padding: 5px 5px 5px 6px;
  border-radius: 50%;
  font-size: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.9;
}
.info{
  height: 60px;
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-40%);
}
.song{
  font-size:14px;
  display: block;
  cursor: pointer;
  padding-bottom: 10px;
}

.icon{
  font-size: 28px;
  height:16px;
  color: #1DCF9F;
}
.artists{
  display: inline-block;
  font-size: 13px;
  font-weight:300;
  margin-left: 1px;
  padding: 0;
  cursor: pointer;
}
.artists:hover{
  text-decoration: underline;
}
</style>
