<template>
  <div style="width: calc((var(--block-size) + 20px) * var(--block-num))">
    <div class="head">
      <div class="cover">
        <img :preview="false" :src="info.image" style="width: 100%">
      </div>
      <div class="content">
        <div class="info">
          <span class="h1" style="margin-bottom: 0px">{{ info.name }}</span>

          <!--          <div style="position: relative; margin-top: 5px;">-->
          <!--            <span id="description" :class="showAll?'description-show':'description'">{{ info.description }}-->
          <!--              <br><a v-if="showAll" style="float: right;font-size: 13px" @click="showAll=false">[收起]</a>-->
          <!--            </span>-->
          <!--            <a v-if="isOverflow&&!showAll" style="position: absolute;right: 0;font-size: 13px" @click="showAll=true">[展开]</a>-->
          <!--          </div>-->
        </div>
        <div class="creator">
          <img :src="info.artist.picUrl+'?param=100y100'" style="margin-right: 10px;width: 36px;border-radius: 50%">
          <div style="display: flex;flex-direction: column">
            <span>{{ info.artist.name }}</span>
            <div>
              <span style="color: #929292;">发行于 {{ DateFormat(info.publishTime) }} • {{ info.size }}首歌</span>
<!--              <div class="tabs">
                <span v-for="item of info.tags" :key="item" style="margin-right: 10px">#{{ item }}</span>
              </div>-->
            </div>
          </div>
        </div>
        <div>
          <span id="description" class="description">{{ info.description }}
          </span>
        </div>
        <div class="handle">
          <button class="bt-play discolour" @click="playAll(0)"><svg-icon name="play-fill" /> 播放</button>
          <button class="discolour"><svg-icon name="love" /></button>
          <button class="discolour">•••</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import PlayItem from '@/pages/playList/components/PlayItem.vue'
import ContextMenu from '@/components/ContextMenu.vue'
import { getListById, getMusicDetail } from '@/api/music'

export default defineComponent({
  name: 'ListHead',
  props: {
    info: Object
  },
  setup(props) {
    console.log(props.info)
    const DateFormat = (date:string) => {
      const time = new Date(date)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      return y + '年' + (m < 10 ? ('0' + m) : m) + '月' + (d < 10 ? ('0' + d) : d) + '日'
    }

    return {
      DateFormat
    }
  }
})
</script>

<style scoped>
.head{
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
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
.tabs{
  display: inline-block;
  margin-left: 20px;
  color: #929292;
}
.description{
  width: 100%;
  font-size: 13px;
  color: #929292;
  padding-right: 40px;
  /*display: inline-block;*/
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  /*white-space:nowrap;*/
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.description-mask{
  width: 100%;
  position: absolute;
  z-index: 3;
  filter: blur(30px);
  overflow: hidden;
  background: #1DCF9F;
}
.description-show{
  width: 100%;
  font-size: 13px;
  position: absolute;
  padding: 10px 20px 5px 20px;
  z-index: 3;
  border-radius: 5px;
  overflow: hidden;
}
.description-show:after{
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  filter: blur(30px);
  background: #eeeeee;
  z-index: -1;
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
