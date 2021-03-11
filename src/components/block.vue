<template>
  <div class="block">
    <a-avatar
        class="cover"
        shape="square"
        :size="150"
        src="src/assets/logo.png"
        @click="clickBlock"
        @mouseenter="showPlay"
        @mouseleave="hidePlay">
    </a-avatar>
    <div class="show" v-if="isShow">
    </div>
    <svg-icon class="play" name="play" v-if="isShow" @mouseenter="showPlay" @click="clickBlock"></svg-icon>
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
    },
    hidePlay(): void{
      this.isShow= false
    }
  }
}
</script>

<style scoped>
.block{
  display: flex;
  width: 150px;
  height: 150px;
  border-radius: 5px;
  position: relative;
  background: #efd914;
  transition: transform 0.1s;
}
.block:hover{
  transition: transform 0.3s;
  transform: translateY(-10px);

}
.cover{
  z-index: 0;
}
.show{
  pointer-events:none;
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 5px;
  background: rgba(153,153,153,0.2);
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
  color: #1DCF9F;
}
</style>
