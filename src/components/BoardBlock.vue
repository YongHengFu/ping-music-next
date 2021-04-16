<template>
  <div class="container">
    <div class="cover">
      <a-image :src="data.coverImgUrl" />
<!--      <span class="title">飙升</span>-->
    </div>
    <div class="list">
      <p style="font-size: 26px;font-weight: bolder;margin-bottom: 15px">{{ data.name }}</p>
      <span v-for="(item,index) of data.tracks" :key="item.first" class="music">{{ index+1 }}&nbsp;&nbsp;&nbsp;{{ item.first }}-{{ item.second }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BoardBlock',
  props: {
    data: {
      type: Object
    }
  }
})
</script>

<style scoped>
.container{
  display: flex;
  flex-direction: row;
  background: #F0F0F0;
  border-radius: 10px;
  width: 500px;
}
.cover{
  position: relative;
  flex: 1;
  background: #FFFFFF;
  border-radius: 10px;
  margin-right: 20px;
}
.title{
  color: #FFFFFF;
  font-size: 18px;
  font-weight: bolder;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 2;
}
.list{
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1.5;
}
.music{
  font-size: 18px;
  margin-bottom: 10px;
  color: #525151;
}
</style>
