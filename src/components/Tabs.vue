<template>
  <div class="tabs">
    <div
      v-for="(item,ind) of tabList"
      :key="item.name"
      class="pane"
      :style="ind===index?'color:var(--primary-color)!important;':'color: rgb(69, 74, 80);'"
      @click="change(ind,item.name)"
    >{{ item.table }} </div>
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
      tabList: [
        { table: '精选', name: 'Featured' },
        { table: '榜单', name: 'Leaderboard' },
        { table: '歌手', name: 'Featured' },
        { table: '专辑', name: 'Featured' },
        { table: '视频', name: 'Featured' },
        { table: '电台', name: 'Featured' }
      ],
      sliderLeft: { 'margin-left': '0px' }
    }
  },
  methods: {
    change(ind, name) {
      if (ind !== this.index) {
        this.index = ind
        this.sliderLeft['margin-left'] = (100 * ind) + 'px'
        this.$emit('changeTab', name)
      }
    }
  }
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
