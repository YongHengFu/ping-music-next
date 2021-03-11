<template>
  <div class="block">
    <a-avatar class="cover" shape="square" :size="150" @click.stop="clickBlock" @mouseenter="showPlay" @mouseleave="hidePlay"></a-avatar>
    <svg-icon class="show" name="play" v-if="isShow"></svg-icon>
  </div>
</template>

<script lang="ts">
interface dataType{
  isShow: boolean
}
export default {
  data(): dataType {
    return {
      isShow: false
    }
  },
  methods: {
    clickBlock(){
      console.log('click')
    },
    showPlay(): void{
      this.isShow= true
      console.log('移入')
    },
    hidePlay(): void{
      console.log('移出')
      this.isShow= false
    }
  }
}
</script>

<style scoped>
.block{
  display: flex;
  width: 150px;
  position: relative;
}
.cover{
  z-index: 0;
}
.show{
  pointer-events:none;
  position: absolute;
  width: 60px;
  height: 60px;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  z-index: 1;
}
</style>
