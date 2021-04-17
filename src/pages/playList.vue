<template>
  <div style="width: calc((var(--block-size) + 20px) * var(--block-num))">
    <div class="head">
      <div class="cover">
        <a-image :preview="false" src="src/assets/image/cover.png" />
      </div>
      <div class="content">
        <div class="info">
          <span class="h2">在路上</span>
          <div class="creator">
            <a-avatar src="src/assets/image/cover.png" :size="30"  />
            <span>starshine</span>
            <div class="tabs">
              <span v-for="n of 3" :key="n" style="margin-right: 10px">#华语</span>
            </div>
          </div>

          <span>星光不问赶路人，岁月不负有心人。目光所至，心之所向。</span>
        </div>
        <div class="handle">
          <button>播放全部</button>
          <button>收藏</button>
          <button>下载</button>
          <button>分享</button>
        </div>
      </div>
    </div>
    <MusicList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MusicList from '@/components/MusicList.vue'

export default defineComponent({
  name: 'PlayList',
  components: {
    MusicList
  }
})
</script>

<style scoped>
.head{
  display: flex;
  flex-direction: row;
}
.cover{
  width: 150px;
  min-width: 150px;
  margin-right: 20px;
  border: #999999 solid 1px;
}
.content{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.tabs{
  display: inline-block;
  margin-left: 30px;
}
button{
  width: 100px;
  padding: 2px 0;
  border-radius: 20px;
  border: none;
  font-size: 16px;
  color: #FFFFFF;
  margin-right: 10px;
  outline: none;
  background: var(--primary-color);
}
</style>
