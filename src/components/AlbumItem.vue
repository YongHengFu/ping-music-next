<template>
  <div class="album-item">
    <div style="display: flex;align-items: center">
      <span class="index">{{index+1}}<svg-icon name="play-fill" class="play-fill discolour" /></span>
      <span class="music-name">{{ music.name }}</span>
    </div>
    <span class="time"><svg-icon name="love" class="love" />{{ timeFormat(music.duration/1000) }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import timeFormat from '@/utils/timeFormat'
export default defineComponent({
  name: 'AlbumItem',
  props: {
    music: Object,
    index: Number
  },
  setup() {
    return {
      timeFormat
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
.music-name{
  font-size: 18px;
  font-weight: bolder;
}
.love{
  margin-right: 20px;
  color: #cccccc;
  visibility: hidden;
}
</style>
