<template>
  <div class="tabs">
    <div
      v-for="(item,ind) of tabList"
      :key="item"
      class="pane"
      :style="ind===index?'color:var(--primary-color)!important;':'color: rgb(69, 74, 80);'"
      @click="change(ind)"
    >{{ item }} </div>
    <div class="slider" :style="sliderLeft">
      <div class="indicator" />
    </div>
  </div></template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Tabs',
  data() {
    return {
      index: 0,
      tabList: ['精选', '排行榜', '歌手', '专辑', '视频', '电台'],
      sliderLeft: { 'margin-left': '0px' },
    }
  },
  methods: {
    change(ind) {
      if (ind !== this.index) {
        this.index = ind
        this.sliderLeft['margin-left'] = (100 * ind) + 'px'
      }
    },
  },
})
</script>

<style scoped>
.tabs{
  transform: translateX(-34px);
}
.tabs .pane{
  font-size: 16px;
  font-weight: bolder;
  text-align: center;
  padding-bottom: 5px;
  display: inline-block;
  width: 100px;
  color: rgb(69, 74, 80);
}
.pane:hover{
  color: rgba(69, 74, 80, 0.6) !important;
}
.tabs .slider{
  width: 100px;
  transition: 0.5s;
}
.tabs .slider .indicator{
  /*position: absolute;*/
  margin-left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 300px;
}
</style>
