<template>
  <div>
    <div class="switch-mode" @click="mode=!mode">
      <Image :src="modeContent?modeContent.coverImgUrl:''" :type="0" class="mask" />
      <Image :src="modeContent?modeContent.coverImgUrl:''" :type="0" :animation="2" class="cover" style="border-radius: 8px" />
      <div class="info">
        <span class="tab"><svg-icon :name="mode?'crown':'cd'" /> {{ mode?'精选歌单':'网友热碟' }}</span>
        <span class="title">{{ modeContent?.name }}</span>
        <span class="sub-title">{{ modeContent?.description }}</span>
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
      <div v-if="mode" class="order">
        <span class="order-item" :class="currOrder==='\'hot\''?'order-item-active':''" @click="currOrder='\'hot\''">最热</span>
        <span> | </span>
        <span class="order-item" :class="currOrder==='\'new\''?'order-item-active':''" @click="currOrder='\'new\''">最新</span>
      </div>
    </div>
    <div v-if="mode" class="ord-play-list">
      <MaxCover
        v-for="item of ordPlayList"
        :key="item.id"
        :image="item?.coverImgUrl"
        :text="item?.name"
        @open="openList(item?.id)"
        @play="playListAll(item?.id)"
      />
    </div>
    <div v-else class="bou-play-list">
      <div
        v-for="item of bouPlayList"
        :key="item.id"
        class="bou-play-list-item"
        @click="openList(item?.id)"
      >
        <MaxCover
          :image="item?.coverImgUrl"
          :text="''"
          @open="openList(item?.id)"
          @play="playListAll(item?.id)"
        />
        <div class="info">
          <span class="name">{{ item?.name }}</span>
          <span class="creator">By {{ item?.creator?.nickname }}
            <Image
              :src="item.creator?.avatarDetail?.identityIconUrl?item.creator.avatarDetail.identityIconUrl:''"
              :type="1"
              style="width: 15px;height: 15px"
            /></span>
          <span class="desc">{{ item?.copywriter }}</span>
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
    const mode = ref(true)
    const modeContent = ref(null)
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

    watch(mode, () => {
      if (!mode.value) {
        modeContent.value = ordPlayList.value[0]
      } else {
        modeContent.value = bouPlayList.value[0]
      }
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
          if (!mode.value) {
            modeContent.value = ordPlayList.value[0]
          }
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
          modeContent.value = bouPlayList.value[0]
          if (mode.value) {
            modeContent.value = bouPlayList.value[0]
          }
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
      modeContent,
      hotTagList,
      currTagIndex,
      currOrder,
      ordPlayList,
      bouPlayList,
      changeTag,
      openList,
      playListAll
    }
  }
})
</script>

<style scoped>
.switch-mode{
  width: 100%;
  height: calc(var(--block-size) + 20px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 20px;
  position: relative;
  margin-top: 20px;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px solid #E7AA5A;
  background: #000000;
}
.switch-mode .mask{
  width: 100%;
  height: calc(var(--block-size) + 20px);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  filter: blur(40px);
  opacity: 0.8;
  object-fit: cover;
  z-index: 0;
  transform: scale(1.1,1.1);
}
.switch-mode .cover{
  width: calc(var(--block-size) - 20px);
  height: 100%;
  margin-right: 20px;
  border: 1px solid #E7AA5A;
  z-index: 2;
}
.switch-mode .info{
  z-index: 2;
  display: flex;
  flex-direction: column;
}
.switch-mode .info .tab{
  width: 100px;
  border: 1px solid #E7AA5A;
  border-radius: 15px;
  color: #E7AA5A;
  text-align: center;
  padding: 3px 0px;
  background: #3f3f3f;
}
.switch-mode .info .title{
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 10px 0 ;
}
.switch-mode .info .sub-title{
  color: #CFD0D4;
  max-width: calc(var(--page-width) - var(--block-size) - 60px);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
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
  grid-template-columns: repeat(2, calc((var(--page-width) - 20px) / 2));
  grid-template-rows: repeat(1, var(--block-size));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
.bou-play-list-item{
  display: flex;
  cursor: pointer;
}
.bou-play-list-item .info{
  max-width: calc((var(--page-width) - 20px) / 2 - var(--block-size) - 20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
}
.bou-play-list-item .info span{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.bou-play-list-item .info .name{
  font-weight: bold;
  font-size: 16px;
}
.bou-play-list-item .info .creator{
  margin: 20px 0 25px 0;
}
.bou-play-list-item .info .desc{
  color: #acacac;
}
</style>
