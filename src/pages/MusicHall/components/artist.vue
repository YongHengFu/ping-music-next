<template>
  <div>
    <div class="screen">
      <div class="area-list">
        <span
          v-for="(item,index) of areaList"
          :key="item.value"
          class="area-list-item"
          :class="currAreaIndex===index?'area-list-item-active':''"
          @click="changeArea(index)"
        >{{ item.tilte }}</span>
      </div>
      <div class="type-list">
        <span
          v-for="(item,index) of typeList"
          :key="item.value"
          class="type-list-item"
          :class="currTypeIndex===index?'type-list-item-active':''"
          @click="changeType(index)"
        >{{ item.tilte }}
          <span style="color: #000c17!important;">{{ index===typeList.length-1?'':' | ' }}</span>
        </span>
      </div>
    </div>
    <div class="artist-list">
      <ArtistCover
        v-for="item of artistList"
        :key="item.id"
        :image="item?.picUrl"
        :text="item?.name"
        :artist-id="item?.id"
        class="artist-list-item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import ArtistCover from '@/components/ArtistCover.vue'
import { getArtistList } from '@/api/music'

export default defineComponent({
  name: 'Artist',
  components: {
    ArtistCover
  },
  setup() {
    const artistList = ref(<any>[])
    const currAreaIndex = ref(0)
    const currTypeIndex = ref(0)
    const areaList = [
      { tilte: '全部', value: '-1' },
      { tilte: '华语', value: '7' },
      { tilte: '欧美', value: '96' },
      { tilte: '日本', value: '8' },
      { tilte: '韩国', value: '16' },
      { tilte: '其他', value: '0' }
    ]
    const typeList = [
      { tilte: '全部', value: '-1' },
      { tilte: '男歌手', value: '1' },
      { tilte: '女歌手', value: '2' },
      { tilte: '乐队组合', value: '3' }
    ]

    const changeArea = (index:number) => {
      currAreaIndex.value = index
      getArtistData()
    }
    const changeType = (index:number) => {
      currTypeIndex.value = index
      getArtistData()
    }

    const getArtistData = () => {
      const param = {
        limit: 60,
        area: areaList[currAreaIndex.value].value,
        type: typeList[currTypeIndex.value].value
      }
      getArtistList(param).then((res:any) => {
        if (res.code === 200) {
          artistList.value = res.artists
        }
      })
    }

    onMounted(() => {
      getArtistData()
    })

    return {
      areaList,
      typeList,
      currAreaIndex,
      currTypeIndex,
      artistList,
      changeArea,
      changeType
    }
  }
})
</script>

<style scoped>
.screen{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.area-list .area-list-item{
  padding: 1px 10px;
  margin-right: 10px;
  border-radius: 15px;
  cursor: pointer;
}
.area-list .area-list-item-active{
  background: var(--light-color);
  color: var(--primary-color);
}
.type-list .type-list-item{
  cursor: pointer;
}
.type-list .type-list-item-active{
  color: var(--primary-color);
}
.artist-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.area-list .area-list-item{
  width: var(--block-size);
  height: var(--block-size);
}
</style>
