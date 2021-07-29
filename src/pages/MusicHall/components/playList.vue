<template>
  <div>
    <div class="boutique-entrance">
      <Image :src="''" :type="0" class="mask" />
      <Image :src="''" :type="0" class="cover" style="border-radius: 8px" />
      <div class="info">
        <span class="tab"><svg-icon name="crown" /> 精品歌单</span>
        <span class="title">时光成诗</span>
        <span class="sub-title">岁月留声，经典不逝</span>
      </div>
    </div>
    <div class="screen">
      <div class="tags">
        <span
          v-for="(item,index) of hotTagList"
          :key="item"
          class="tags-item"
          :class="currTagIndex===index?'tags-item-active':''"
          @click="changeTag(index)"
        >{{ item }}</span>
      </div>
      <div v-if="mode==='ord'" class="order">
        <span class="order-item" :class="currOrder==='\'hot\''?'order-item-active':''" @click="currOrder='\'hot\''">最热</span>
        <span> | </span>
        <span class="order-item" :class="currOrder==='\'new\''?'order-item-active':''" @click="currOrder='\'new\''">最新</span>
      </div>
    </div>
    <div v-if="mode==='ord'" class="ord-play-list">
      <MaxCover
        v-for="item of ordPlayList"
        :key="item.id"
        :image="item?.coverImgUrl"
        :text="item?.name"
        @open="openList(item?.id)"
        @play="playListAll(item?.id)"
      />
    </div>
    <div v-if="mode==='bou'" class="bou-play-list">
      <div
        v-for="item of bouPlayList"
        :key="item.id"
        class="bou-play-list-item"
      >
        <MaxCover
          :image="item?.coverImgUrl"
          :text="''"
          @open="openList(item?.id)"
          @play="playListAll(item?.id)"
        />
        <div class="info">
          <span class="name">{{item?.name}}</span>
          <span class="creator">{{item?.creator?.nickname}}</span>
          <span class="desc">{{item?.copywriter}}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MaxCover from '@/components/MaxCover.vue'
import { getHotTagsPlayList, getHqPlayList, getTopPlayList } from '@/api/music'
import { playList } from '@/utils/musicList'

export default defineComponent({
  name: 'PlayList',
  components: {
    MaxCover
  },
  setup() {
    const router = useRouter()
    const mode = ref('bou')
    const hotTagList = ref(['全部'])
    const currTagIndex = ref(0)
    const currOrder = ref('\'hot\'')
    const ordPlayList = ref(<any>[])
    const bouPlayList = ref(<any>[])

    watch(currTagIndex, () => {
      getTopPlayListData()
      getHqPlayListData()
    })

    watch(currOrder, () => {
      getTopPlayListData()
      getHqPlayListData()
    })

    const getHotTagList = () => {
      getHotTagsPlayList().then((res:any) => {
        if (res.code === 200) {
          for (const item of res.tags) {
            hotTagList.value.push(item.name)
          }
        }
      })
    }

    const getTopPlayListData = () => {
      const param = {
        order: currOrder.value,
        cat: hotTagList.value[currTagIndex.value],
        limit: 50
      }
      getTopPlayList(param).then((res:any) => {
        if (res.code === 200) {
          ordPlayList.value = res.playlists
        }
      })
    }

    const getHqPlayListData = () => {
      const param = {
        cat: hotTagList.value[currTagIndex.value],
        limit: 50
      }
      getHqPlayList(param).then((res:any) => {
        if (res.code === 200) {
          bouPlayList.value = res.playlists
        }
      })
    }

    const openList = (id:string) => {
      router.push('/playList/' + id)
    }

    const playListAll = (id:string) => {
      playList(id)
    }

    const changeTag = (index:number) => {
      currTagIndex.value = index
    }

    onMounted(() => {
      getHotTagList()
      getTopPlayListData()
      getHqPlayListData()
    })
    return {
      mode,
      hotTagList,
      currTagIndex,
      currOrder,
      ordPlayList,
      changeTag,
      openList,
      playListAll,
      bouPlayList
    }
  }
})
</script>

<style scoped>
.boutique-entrance{
  width: 100%;
  height: calc(var(--block-size) + 20px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 20px;
  position: relative;
  border: 1px solid #E7AA5A;
  margin-top: 20px;
  overflow: hidden;
  cursor: pointer;
}
.boutique-entrance .mask{
  width: 100%;
  height: calc(var(--block-size) + 20px);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  filter: blur(50px);
  object-fit: cover;
  z-index: 0;
}
.boutique-entrance .cover{
  border: 1px solid #E7AA5A;
  width: calc(var(--block-size) - 20px);
  height: 100%;
  margin-right: 10px;
  z-index: 2;
}
.boutique-entrance .info{
  z-index: 2;
  display: flex;
  flex-direction: column;
}
.boutique-entrance .info .tab{
  border: 1px solid #E7AA5A;
  border-radius: 15px;
  color: #E7AA5A;
  padding: 5px 10px;
  background: #3f3f3f;
}
.boutique-entrance .info .title{
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px 0 ;
}
.boutique-entrance .info .sub-title{
  color: #b6b6b6;
}
.boutique-entrance .info .tab{
  border: 1px solid #E7AA5A;
  border-radius: 15px;
  color: #E7AA5A;
  padding: 5px 10px;
  background: #3f3f3f;
}
.screen{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.tags .tags-item{
  padding: 1px 10px;
  margin-right: 10px;
  border-radius: 15px;
  cursor: pointer;
}
.tags .tags-item-active{
  background: var(--light-color);
  color: var(--primary-color);
  /*font-weight: bolder;*/
}
.order .order-item{
  cursor: pointer;
}
.order .order-item-active{
  color: var(--primary-color);
}

.ord-play-list{
  display: grid;
  grid-template-columns: repeat(var(--block-num), var(--block-size));
  grid-template-rows: repeat(1, calc(var(--block-size) + 15px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.bou-play-list{
  display: grid;
  grid-template-columns: repeat(3, calc((var(--page-width) - 40px) / 3));
  grid-template-rows: repeat(1, var(--block-size));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.bou-play-list-item{
  display: flex;
}
.bou-play-list-item .info{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
