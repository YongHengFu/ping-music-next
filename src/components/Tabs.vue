<template>
  <div class="tabs" :style="'transform: translateX(-'+translateX+'px)'">
    <div
      v-for="(item,ind) of tabList"
      :key="item.name"
      class="pane"
      :style="ind===index?'color:var(--primary-color);font-size:18px;':'color: rgb(69, 74, 80);'"
      @click="change(ind,item.name)"
    >{{ item.title }} </div>
    <div class="slider" :style="'margin-left:'+left+'px'">
      <div class="indicator" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'Tabs',
  props: {
    tabList: Array,
    tabName: String
  },
  setup(props, ctx) {
    const index = ref(0)
    const left = ref(0)
    const translateX = computed(() => (80 - (props?.tabList[0]?.title.replace(/[^\x00-\xff]/g, '01').length) * 8) / 2)
    watch(props, () => {
      for (const [index, item] of props?.tabList.entries()) {
        if (item.name === props.tabName) {
          change(index, props.tabName)
          break
        }
      }
    })
    const change = (ind:number, name:string) => {
      if (ind !== index.value) {
        index.value = ind
        left.value = ind * 80
        ctx.emit('changeTab', name)
      }
    }

    return {
      translateX,
      index,
      left,
      change
    }
  }
})
</script>

<style scoped>
.tabs .pane{
  font-size: 16px;
  font-weight: bolder;
  text-align: center;
  padding-bottom: 5px;
  display: inline-block;
  width: 80px;
  color: rgb(69, 74, 80);
  cursor: pointer;
}
.pane:hover{
  color: rgba(69, 74, 80, 0.6);
}
.tabs .slider{
  width: 80px;
  transition: 0.5s;
}
.tabs .slider .indicator{
  margin-left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 20px;
}
</style>
