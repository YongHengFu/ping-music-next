<template>
  <div class="page-video">
    <span class="h1">Music Video</span>
    <div class="screen">
      <div class="type-list">
        <span
          v-for="(item,index) of typeList"
          :key="item"
          class="type-list-item"
          :class="currTypeIndex===index?'type-list-item-active':''"
          @click="changeType(index)"
        >{{ item }}</span>
      </div>
      <div class="order-list">
        <span
          v-for="(item,index) of orderList"
          :key="item"
          class="order-list-item"
          :class="currOrderIndex===index?'order-list-item-active':''"
          @click="changeOrder(index)"
        >{{ item }}
          <span style="color: #000c17!important;">{{ index===orderList.length-1?'':' | ' }}</span>
        </span>
      </div>
    </div>
    <div class="mv-list">
      <VideoCover
        v-for="item of mvList"
        :key="item?.id"
        :image="item?.cover"
        :video-id="item?.id"
        :text="item?.name"
        type="mv"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import VideoCover from '@/components/VideoCover.vue'
import { getAllMv } from '@/api/music'
export default defineComponent({
  name: 'Video',
  components: {
    VideoCover
  },
  setup() {
    const mvList = ref(<any>[])
    const currTypeIndex = ref(0)
    const currOrderIndex = ref(0)
    const typeList = ['全部', '官方版', '原声', '现场版', '网易出品']
    const orderList = ['上升最快', '最热', '最新']

    const changeType = (index:number) => {
      currTypeIndex.value = index
      getAllMvData()
    }
    const changeOrder = (index:number) => {
      currOrderIndex.value = index
      getAllMvData()
    }

    const getAllMvData = () => {
      const param = {
        limit: 100,
        type: typeList[currTypeIndex.value],
        order: orderList[currOrderIndex.value]
      }
      getAllMv(param).then((res:any) => {
        if (res.code === 200) {
          mvList.value = res.data
        }
      })
    }

    onMounted(() => {
      getAllMvData()
    })

    return {
      typeList,
      orderList,
      currOrderIndex,
      currTypeIndex,
      mvList,
      changeType,
      changeOrder
    }
  }
})
</script>

<style scoped>
.page-video{
  width: var(--page-width);
}
.screen{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.type-list .type-list-item{
  padding: 1px 10px;
  margin-right: 10px;
  border-radius: 15px;
  cursor: pointer;
}
.type-list .type-list-item-active{
  background: var(--light-color);
  color: var(--primary-color);
}
.order-list .order-list-item{
  cursor: pointer;
}
.order-list .order-list-item-active{
  color: var(--primary-color);
}
.mv-list{
  display: grid;
  grid-template-columns: repeat(4, calc((var(--page-width) - 60px) / 4));
  grid-template-rows: repeat(1, calc(((var(--page-width) - 60px) / 4) * (9 / 16) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
</style>
