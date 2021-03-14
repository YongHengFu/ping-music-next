<template>
  <div class="block">
    <a-avatar
        class="cover"
        shape="square"
        src="src/assets/image/cover.png"
        @click="clickBlock"
        @mouseenter="showPlay"
        @mouseleave="hidePlay">
    </a-avatar>
    <div class="mask" v-if="isShow">
    </div>
    <svg-icon class="play" name="play" v-if="isShow" @mouseenter="showPlay" @click="clickBlock"></svg-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
// interface dataType{
//   isShow: boolean
// }
export default defineComponent({
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    clickBlock() {
      console.log('click');
    },
    showPlay(): void {
      this.isShow = true;
    },
    hidePlay(): void {
      this.isShow = false;
    },
  },
});
</script>

<style scoped>
.block{
  width: var(--block-size);
  height: var(--block-size);
  border-radius: 8px;
  position: relative;
  background: #efd914;
  /*transition: transform 0.2s;*/
}
/*.block:hover{*/
/*  transition: transform 0.5s;*/
/*  transform: translateY(-10px);*/
/*}*/

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
  width: 50px;
  height: 50px;
  margin: auto;
  color: #FFFFFF;
  z-index: 2;
}
.play:hover{
  color: var(--primary-color);
}
</style>
