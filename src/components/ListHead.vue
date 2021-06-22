<template>
  <div class="head">
    <div class="cover">
      <img :preview="false" :src="info.image+'?param=500y500'" style="width: 100%">
    </div>
    <div class="content">
      <div class="info">
        <span class="h1" style="margin-bottom: 0px">{{ info.name }}</span>
      </div>
      <div class="creator">
        <img :src="info.creatorImg+'?param=100y100'" style="margin-right: 10px;width: 36px;border-radius: 50%">
        <div style="display: flex;flex-direction: column">
          <span>{{ info.creatorName }}</span>
          <div>
            <span style="color: #929292;">{{ type===1?'发行于':'更新于' }}{{ DateFormat(info.time) }} • {{ info.length }}首歌</span>
            <div v-if="type===2" class="tags">
              <span v-for="item of info.tags" :key="item" style="margin-right: 10px">#{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span id="description" class="description" :title="info.description">{{ info.description }}
        </span>
      </div>
      <div class="handle">
        <button class="bt-play discolour" @click="playAll"><svg-icon name="play-fill" /> 播放</button>
        <button class="discolour"><svg-icon name="love" /></button>
        <button class="discolour">•••</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ListHead',
  props: {
    info: Object,
    type: Number
  },
  setup(props, ctx) {
    const DateFormat = (date:string) => {
      const time = new Date(date)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      return y + '年' + (m < 10 ? ('0' + m) : m) + '月' + (d < 10 ? ('0' + d) : d) + '日'
    }

    const playAll = () => {
      ctx.emit('playAll')
    }

    return {
      DateFormat,
      playAll
    }
  }
})
</script>

<style scoped>
.head{
  display: flex;
  flex-direction: row;
  margin-bottom: 80px;
  justify-content: space-between;
}
.cover{
  width: 280px;
  border-radius: 15px;
  overflow: hidden;
}
.content{
  width: calc(100% - 350px);
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.creator{
  display: flex;
  align-items: center;
}
.tags{
  display: inline-block;
  margin-left: 20px;
  color: #929292;
}
.description{
  width: 100%;
  font-size: 13px;
  color: #929292;
  padding-right: 40px;
  user-select: none;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
button{
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  color: #FFFFFF;
  margin-right: 20px;
  outline: none;
  font-weight: bolder;
  color: #1a1a1a;
}
.bt-play{
  width: 100px;
  font-size: 18px;
}
</style>
