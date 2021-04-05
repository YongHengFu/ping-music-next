<template>
  <div style="user-select: none;padding: 20px 30px">
    <span class="h1">最近播放</span>
    <div class="selections">
      <div @click="select=!select" style="cursor: pointer">
        <span :style="{color: select?'var(--primary-color)':'#000000'}">歌曲</span>
        <div class="line" v-if="select"/>
      </div>
      <div @click="select=!select" style="cursor: pointer">
        <span :style="{color: !select?'var(--primary-color)':'#000000'}">视频</span>
        <div class="line" v-if="!select"/>
      </div>
    </div>
    <div>
      <button class="playAll"><svg-icon name="listPlay"/> 播放全部</button>
    </div>
    <MusicList :data="detailList" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import MusicList from '@/components/MusicList.vue'
export default defineComponent({
  name: 'HistoryPlay',
  components: {
    MusicList
  },
  data() {
    return {
      select: true
    }
  },
  computed: {
    detailList() {
      return this.$store.state.detailList
    }
  }
})
</script>

<style scoped>
.selections{
  width: 120px;
  margin: 10px 0 20px 0;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.line{
  height: 4px;
  width: 25px;
  background: var(--primary-color);
  border-radius: 10px;
  margin-top: 3px;
  margin-left: 50%;
  transform: translateX(-50%);
  transition: 1s;
}
.playAll{
  cursor: pointer;
  border: none;
  outline: none;
  font-size: 16px;
  background: var(--primary-color);
  color: #FFFFFF;
  border-radius: 30px;
  padding: 5px 15px;
  margin-bottom: 20px;
}
</style>
