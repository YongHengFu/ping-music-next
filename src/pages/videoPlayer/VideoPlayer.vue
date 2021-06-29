<template>
  <div class="page-video-player">
    <div class="player">
      <span v-if="!isReady" class="play-loading">正在获取视频...</span>
      <vue-plyr v-else :options="playerOptions" class="plyr">
        <video
          controls
          crossorigin
          playsinline
          data-poster="poster.jpg"
        >
          <source
            v-for="item of videoSrcList"
            :key="item?.size"
            :size="item?.size"
            :src="item?.src"
            type="video/mp4"
          >
        </video>
      </vue-plyr>
    </div>
    <div style="display: flex;justify-content: space-between;align-items: flex-end;margin-top: 10px">
      <span style="font-size: 24px;font-weight: bolder">{{ videoInfo?.artistName }}-{{ videoInfo?.name }}</span>
      <!--      <div>-->
      <!--        <span>{{ videoInfo?.publishTime }}</span>-->
      <!--      </div>-->
    </div>
    <div style="margin-top: 30px">
      <span class="h2">相关视频</span>
      <!--      <span class="discolour" style="float: right;cursor: pointer">更多</span>-->
      <div class="video-list">
        <div v-for="item of simiMvList" :key="item?.id" class="video-item">
          <Image :type="0" :src="item?.cover" radius="8px" class="video-image" @click="openVideo(item?.id)" />
          <span>{{ item?.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getMvDetail, getMvUrl, getSimiMv } from '@/api/music'

export default defineComponent({
  name: 'VideoPlayer',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const blockNum = computed(():number => store.state.blockNum)
    const videoSrcList = ref(<any>[])
    const videoInfo = ref({})
    const simiMvList = ref(<any>[])
    const isReady = ref(false)
    const playerOptions = {
      i18n: {
        quality: '清晰度',
        speed: '倍数',
        normal: '正常'
      }
    }

    const getMvData = () => {
      const param = { mvid: route.params?.id }
      getMvDetail(param).then(async(res:any) => {
        if (res.code === 200) {
          videoInfo.value = res.data
          for (const item of res.data.brs) {
            await getMvPlayUrl(item.br)
          }
          isReady.value = true
        }
      })
    }

    const getMvPlayUrl = async(br:string) => {
      const param = {
        id: route.params?.id,
        r: br
      }
      await getMvUrl(param).then((res) => {
        if (res.code === 200) {
          const video = {
            size: res.data.r,
            src: res.data.url
          }
          videoSrcList.value.push(video)
        }
      })
    }

    const getSimiMvList = () => {
      const param = { mvid: route.params?.id }
      getSimiMv(param).then((res:any) => {
        console.log(res)
        if (res.code === 200) {
          simiMvList.value = res.mvs
        }
      })
    }

    const openVideo = (id:string) => {
      // router.push('/videoPlayer/' + id)
      router.replace('/videoPlayer/' + id)
    }

    onMounted(() => {
      getMvData()
      getSimiMvList()
    })

    return {
      blockNum,
      playerOptions,
      videoSrcList,
      videoInfo,
      simiMvList,
      isReady,
      openVideo
    }
  }
})
</script>

<style scoped>
.page-video-player{
  width: var(--page-width);
}
.player{
  background: #000c17;
  width: var(--page-width);
  height: calc(var(--page-width) * (9 / 16));
  position: relative;
  --plyr-color-main: var(--primary-color);
  border-radius: 15px;
  overflow: hidden;
}
.play-loading{
  color: #FFFFFF;
  font-size: 18px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.video-list{
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, calc((100% - 80px) / 5));
  grid-template-rows: repeat(1, calc(((100% - 80px) / 5) * (9 / 16) + 15px));
  grid-gap: 10px 20px;
  margin-top: 15px;
}
.video-image{
  cursor: pointer;
  transition: 0.3s;
}
.video-image:hover{
  transform: translateY(-10px);
}
</style>
