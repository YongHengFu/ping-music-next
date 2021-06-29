<template>
  <div>
    <div class="container" @mouseleave="leave" @mouseenter="enter">
      <LeftCircleFilled v-if="controlButton" class="prevIcon" @click="prev" />
      <RightCircleFilled v-if="controlButton" class="nextIcon" @click="next" />
      <div v-for="n of 5" :key="n" :class="item[n-1]?.class">
        <div style="position: relative;border-radius: 5px;overflow: hidden;cursor: pointer;width: 100%;height: 100%;">
          <Image
            :src="show[n-1]?.imgBase64"
            :type="0"
            style="border-radius: 5px;width: 100%;height: 100%;object-fit: contain"
            @click="action(show[n-1])"
          />
          <span class="tab">{{ show[n-1]?.typeTitle }}</span>
        </div>
      </div>
      <div class="points">
        <div v-for="(item,ind) of banners" :key="item" :class="ind===index?'point-L':'point'" />
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons-vue'
import { getBanner } from '@/api/music'
import { playSingle } from '@/utils/musicList'
import imageToBase64 from '@/utils/imageToBase64'

export default defineComponent({
  name: 'Banner',
  components: {
    LeftCircleFilled,
    RightCircleFilled
  },
  setup() {
    const router = useRouter()
    const index = ref(0)
    const item = ref([
      { position: 0, class: 'middle' },
      { position: 1, class: 'right' },
      { position: 2, class: 'right-out' },
      { position: 3, class: 'left-out' },
      { position: 4, class: 'left' }
    ])
    const show = ref(<any>[])
    const banners = ref(<any>[])
    // eslint-disable-next-line no-undef
    let interval: NodeJS.Timeout | null = null
    const controlButton = ref(false)

    const getBannerData = async() => {
      await getBanner().then((res:any) => {
        if (res.code === 200) {
          banners.value = res.banners
        }
      })
    }
    const bannersInit = async() => {
      for (let i = 0; i < banners.value.length; i++) {
        banners.value[i].No = i
        banners.value[i].imgBase64 = await imageToBase64(banners.value[i].imageUrl + '?param=1080y400')
        if (i < 5) {
          show.value.push(banners.value[i])
        }
      }
      show.value.push(banners.value[banners.value.length - 1])
      initPrev()
      initNext()
      autoExe()
    }
    const leave = () => {
      controlButton.value = false
      autoExe()
    }
    const enter = () => {
      controlButton.value = true
      stopExe()
    }
    // 定时轮播
    const autoExe = () => {
      function exeNext() {
        next()
      }
      if (interval == null) {
        interval = setInterval(exeNext, 3000)
      }
    }
    // 停止轮播
    const stopExe = () => {
      if (interval !== null) {
        clearInterval(interval)
        interval = null
      }
    }
    const initPrev = () => {
      let NoM = ''
      let positionM = 0
      let NoL = ''
      let positionL = 0
      let positionLO = 0

      for (let i = 0; i < 5; i++) {
        if (item.value[i].class === 'middle') {
          positionM = item.value[i].position
          NoM = show.value[positionM].No
        } else if (item.value[i].class === 'left') {
          positionL = item.value[i].position
          NoL = show.value[positionL].No
        } else if (item.value[i].class === 'left-out' || item.value[i].class === 'left-out-no') {
          positionLO = item.value[i].position
        }
      }
      if (NoL < NoM && NoL === banners.value[0].No) {
        show.value[positionLO] = banners.value[banners.value.length - 1]
      } else {
        for (const [index, dataItem] of banners.value.entries()) {
          if (dataItem.No === NoL) {
            show.value[positionLO] = banners.value[index - 1]
            break
          }
        }
      }
    }
    const initNext = () => {
      let NoM = ''
      let positionM = 0
      let NoR = ''
      let positionR = 0
      let positionRO = 0

      for (let i = 0; i < 5; i++) {
        if (item.value[i].class === 'middle') {
          positionM = item.value[i].position
          NoM = show.value[positionM].No
        } else if (item.value[i].class === 'right') {
          positionR = item.value[i].position
          NoR = show.value[positionR].No
        } else if (item.value[i].class === 'right-out' || item.value[i].class === 'right-out-no') {
          positionRO = item.value[i].position
        }
      }
      if (NoR > NoM && NoR === banners.value[banners.value.length - 1].No) {
        show.value[positionRO] = banners.value[0]
      } else {
        for (const [index, dataItem] of banners.value.entries()) {
          if (dataItem.No === NoR) {
            show.value[positionRO] = banners.value[index + 1]
            break
          }
        }
      }
    }
    const prev = () => {
      initPrev()
      for (let i = 0; i < 5; i++) {
        if (item.value[i].class === 'right-out') {
          item.value[i].class = 'right-out-no'
        } else if (item.value[i].class === 'left-out-no') {
          item.value[i].class = 'left-out'
        }
      }
      const tran:string = item.value[0].class
      item.value[0].class = item.value[1].class
      item.value[1].class = item.value[2].class
      item.value[2].class = item.value[3].class
      item.value[3].class = item.value[4].class
      item.value[4].class = tran
      if (index.value === 0) {
        index.value = banners.value.length - 1
      } else {
        index.value--
      }
    }
    const next = () => {
      initNext()
      for (let i = 0; i < 5; i++) {
        if (item.value[i].class === 'left-out') {
          item.value[i].class = 'left-out-no'
        } else if (item.value[i].class === 'right-out-no') {
          item.value[i].class = 'right-out'
        }
      }
      const tran:string = item.value[0].class
      item.value[0].class = item.value[4].class
      item.value[4].class = item.value[3].class
      item.value[3].class = item.value[2].class
      item.value[2].class = item.value[1].class
      item.value[1].class = tran
      if (index.value === banners.value.length - 1) {
        index.value = 0
      } else {
        index.value++
      }
    }

    const action = (item: any) => {
      // 1:单曲， 10：专辑， 1004：MV，3000：数字专辑/单曲
      switch (item.targetType) {
        case 1:
          playSong(item.targetId)
          break
        case 10:
          openAblum(item.targetId)
          break
        case 1004:
          playMV(item.targetId)
          break
        case 3000:
          openDigitalAlbum(item.targetId)
          break
      }
    }

    const playSong = (id:string) => {
      playSingle(id)
    }

    const openAblum = (id:string) => {
      router.push('/album/' + id)
    }

    const playMV = (id:string) => {

    }

    const openDigitalAlbum = (id:string) => {

    }

    const init = async() => {
      await getBannerData()
      if (banners.value.length > 0) {
        bannersInit()
      }
    }
    init()

    return {
      index,
      item,
      show,
      banners,
      controlButton,
      leave,
      enter,
      prev,
      next,
      action
    }
  }
})
</script>

<style scoped>
.container{
  width: 800px;
  height: 250px;
  /*marginLeft: 300px;*/
  position: relative;
}
.left-out{
  transition: 1s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translate(-50%,-50%);
  display: none;
}
.left-out-no{
  transition: 1s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  opacity: 0.01;
}
.left{
  transition: 0.4s;
  z-index: 0;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);

}
.middle{
  transition: 0.4s;
  width: 540px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 1;
}
.right{
  transition: 0.4s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  right: 50px;
  left: 318px;
  transform: translateY(-50%);
  z-index: 0;
}
.right-out-no{
  transition: 1s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  right: 50px;
  left: 318px;
  transform: translateY(-50%);
  opacity: 0.01;
}
.right-out{
  transition: 1s;
  width: 432px;
  height: 160px;
  position: absolute;
  top: 50%;
  right: 50px;
  left: 318px;
  transform: translate(50%,-50%);
  display: none;
}

.prevIcon{
  color: rgba(163, 161, 161, 0.8);
  position: absolute;
  font-size: 30px;
  top: 50%;
  left: 65px;
  transform: translate(0%,-50%);
  z-index: 2;
}
.nextIcon{
  color: rgba(163, 161, 161, 0.8);
  position: absolute;
  font-size: 30px;
  top: 50%;
  right: 65px;
  transform: translate(0%,-50%);
  z-index: 2;
}
.points{
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%,-80%);
}
.point{
  display: inline-block;
  width: 5px;
  height: 5px;
  margin: 0 2px;
  background: #d0cece;
  border-radius: 50%;
  transition: 0.1s;
}
.point-L{
  transition: 0.3s;
  display: inline-block;
  width: 15px;
  height: 5px;
  margin: 0 5px;
  background: var(--primary-color);
  border-radius: 15px;
}
.tab{
  position: absolute;
  right: 0;
  bottom: 0;
  background: var(--primary-color);
  color: #FFFFFF;
  padding: 0px 5px;
  font-size: 12px;
  border-radius: 5px 0 ;
}
</style>
