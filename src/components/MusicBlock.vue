<template>
  <div v-if="data.id!==undefined" style="position: relative;height: 60px;width: 33%">
    <div class="cover" @click="clickSong">
      <a-avatar shape="square" :size="60" :src="data.picUrl" />
    </div>
    <div class="info">
      <span class="song" @click="clickSong">{{ data.name }}</span>
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

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MusicBlock',
  components: {

  },
  props: {
    song: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      data: {},
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
    },
  },
})
</script>

<style scoped>
.cover{
  width: 60px;
  height: 60px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
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
}
.song:hover{
  text-decoration: underline var(--primary-color);
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
