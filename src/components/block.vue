<template>
  <div v-if="content">
    <div class="block">
      <img
        class="cover"
        :src="content.coverImgUrl"
        @click="clickBlock"
        @mouseenter="showPlay"
        @mouseleave="hidePlay"
      />
      <div v-if="isShow" class="mask" />
      <svg-icon v-if="isShow" class="play" name="play" @mouseenter="showPlay" @click="clickBlock" />
    </div>
    <span class="title">{{ content.name }}</span>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
// interface dataType{
//   isShow: boolean
// }
export default defineComponent({
  props: {
    content: {
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
      this.$router.push({ name: 'playList', params: { id: this.content.id }})
      // this.$router.push({ path: '/historyPlay' })
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
.block{
  width: var(--block-size);
  height: var(--block-size);
  border-radius: 8px;
  position: relative;
  /*background: #efd914;*/
  user-select: none;
  transition: 0.3s;
}
/*.block:hover{*/
/*  transition: transform 0.5s;*/
/*  transform: translateY(-10px);*/
/*}*/

.title{
  font-size: 14px;
  width: var(--block-size);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  display:block;
}
.cover{
  border-radius: 8px;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.mask{
  pointer-events:none;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 5px;
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
</style>
