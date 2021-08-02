<template>
  <div class="page-video-player">
    <div class="player">
      <span v-if="!isReady" class="play-loading">正在获取视频...</span>
      <vue-plyr
        v-else
        :options="playerOptions"
        :autoplay="true"
        class="plyr"
        @play="onPlay"
      >
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
    </div>
    <div style="margin-top: 30px">
      <span class="h2">相关视频</span>
      <div class="video-list">
        <VideoCover
          v-for="item of simiVideoList"
          :key="item.id"
          :image="item.cover"
          :text="item.name"
          :video-id="item.id"
          :type="route.params.type"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import VideoCover from '@/components/VideoCover.vue'
import { getMvDetail, getMvUrl, getSimiMv, getSimiVideo, getVideoDetail, getVideoUrl } from '@/api/music'

export default defineComponent({
  name: 'VideoPlayer',
  components: {
    VideoCover
  },
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const blockNum = computed(():number => store.state.blockNum)
    const videoSrcList = ref(<any>[])
    const videoInfo = ref({})
    const simiVideoList = ref(<any>[])
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
      await getMvUrl(param).then((res:any) => {
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
        if (res.code === 200) {
          simiVideoList.value = res.mvs.slice(0, 4)
        }
      })
    }

    const getVideoData = () => {
      const param = {
        id: route.params?.id
      }
      getVideoDetail(param).then((res:any) => {
        if (res.code === 200) {
          const info = {
            name: res.data.creator.nickname,
            artistName: res.data.title
          }
          videoInfo.value = info
        }
      })
    }

    const getVideoPlayUrl = () => {
      const param = {
        id: route.params?.id
      }
      getVideoUrl(param).then((res:any) => {
        if (res.code === 200) {
          for (const item of res.urls) {
            const video = {
              size: item.r,
              src: item.url
            }
            videoSrcList.value.push(video)
          }
          isReady.value = true
        }
      })
    }

    const getSimiVideoList = () => {
      const param = { id: route.params?.id }
      getSimiVideo(param).then((res:any) => {
        if (res.code === 200) {
          for (const item of res.data) {
            const video = {
              id: item.vid,
              cover: item.coverUrl,
              name: item.title
            }
            if (simiVideoList.value.length < 4) {
              simiVideoList.value.push(video)
            }
          }
        }
      })
    }

    const openVideo = (id:string) => {
      router.replace('/videoPlayer/' + route.params.type + '/' + id)
    }

    const onPlay = () => {
      const param = { prop: 'state', value: false }
      store.commit('setAudio', param)
    }

    onMounted(() => {
      if (route.params.type === 'mv') {
        getMvData()
        getSimiMvList()
      } else {
        getVideoData()
        getVideoPlayUrl()
        getSimiVideoList()
      }
    })

    return {
      route,
      blockNum,
      playerOptions,
      videoSrcList,
      videoInfo,
      simiVideoList,
      isReady,
      openVideo,
      onPlay
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
  display: grid;
  grid-template-columns: repeat(4, calc((var(--page-width) - 60px) / 4));
  grid-template-rows: repeat(1, calc(((var(--page-width) - 60px) / 4) * (9 / 16) + 20px));
  grid-gap: 20px 20px;
  margin: 20px 0;
}
</style>
