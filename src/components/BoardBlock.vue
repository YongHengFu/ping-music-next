<template>
  <div class="container">
    <div class="cover">
      <div
        @click="clickBlock"
        @mouseenter="showPlay"
        @mouseleave="hidePlay"
      >
        <a-image
          :src="data.coverImgUrl"
          :preview="false"
          style="border-radius: 10px;z-index: 0"
        />
      </div>
      <div v-if="isShow" class="mask" />
      <svg-icon v-if="isShow" class="play" name="play" @mouseenter="showPlay" @click="clickBlock" />
    </div>
    <div class="list">
      <p style="font-size: 22px;font-weight: bolder;margin-bottom: 10px">{{ data.name }}</p>
      <div v-for="(item,index) of data.tracks" :key="item.first" class="music">
        <svg-icon class="number" :name="['one','two','three'][index] " />
        <span class="title">{{ item.first }}-{{ item.second }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BoardBlock',
  components: { },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    clickBlock() {
      console.log('click')
    },
    showPlay(): void {
      this.isShow = true
    },
    hidePlay(): void {
      this.isShow = false
    }
  }
})
</script>

<style scoped>
.container{
  display: flex;
  flex-direction: row;
  background: #efefef;
  border-radius: 10px;
}
.cover{
  position: relative;
  width: var(--block-size);
  height: var(--block-size);
  border-radius: 10px;
  margin-right: 20px;
}
.mask{
  pointer-events:none;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: rgba(83, 82, 82, 0.5);
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  z-index: 1;
}
.play{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: calc(var(--block-size)/4);
  height: calc(var(--block-size)/4);
  margin: auto;
  color: #FFFFFF;
  z-index: 2;
}
.play:hover{
  color: var(--primary-color);
}
.list{
  width: calc(100% - var(--block-size));
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.music{
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.number{
  min-width: 14px;
  margin-right: 10px;
  color: red;
}
.title{
  font-size: 14px;
  color: #525151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  padding-right: 10px;
}
</style>
