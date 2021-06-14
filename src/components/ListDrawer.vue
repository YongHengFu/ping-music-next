<template>
  <div style="user-select: none">
    <Drawer
      id="listContainer"
      placement="right"
      :closable="false"
      :visible="isShowDrawer"
      :get-container="false"
      :mask-closable="true"
      :mask="true"
      width="400"
      :drawer-style="{'background': '#fafafa','padding': '0'}"
      :wrap-style="{ position: 'absolute'}"
      @close="closeDrawer"
    >
      <div style="height: 60px;position: absolute;width:100%;padding: 0 10px;top: 0;z-index: 2;background: #FAFAFA">
        <span class="h2">播放清单</span>
        <div style="color: #454545;width:100%;display: flex;align-items: center;justify-content: space-between;background: #FAFAFA">
          <span>{{ musicList.length }}首歌曲</span>
          <div style="font-size: 12px;display: inline">
            <svg-icon name="batch" style="margin-right: 10px" />
            <svg-icon name="trash" />
          </div>
        </div>
      </div>
      <div style="padding-top: 80px">
        <div
          v-for="(item, index) of musicList"
          :key="item.id"
          class="item"
          :style="index===selectIndex?'background: #efefef':''"
          @click="selectItem(index)"
          @dblclick="switchMusic(index)"
        >
          <div class="info" :style="index===selectIndex?'width: 60%':''">
            <div style="display: flex;flex-direction: row;align-items: center">
              <span class="musicName" :style="index===currIndex?'color: var(--primary-color)':''">{{ item.name }}</span>
              <svg-icon
                name="SQ"
                style="font-size: 28px;height:16px;color: #1DCF9F;min-width: 28px;margin-left: 5px"
              />
              <lottie-player
                v-if="index===currIndex"
                ref="player"
                autoplay
                loop
                mode="bounce"
                :src="playAnimation"
                style="width: 30px;height: 30px"
              />
            </div>
            <div style="display: flex;flex-direction: row;justify-content: space-between">
              <span class="artistName" :style="index===currIndex?'color: var(--primary-color)':''">
                <template
                  v-for="(item2,index2) of item.artist"
                >{{ item2.name }}{{ index2===item.artist.length-1?'':'/' }}</template>
              </span>
              <span class="duration" :style="index===selectIndex?'display:none':''">{{ timeFormat(item.duration) }}</span>
            </div>
          </div>
          <div class="icons" :style="index===selectIndex?'width: 40%;display: flex;justify-content: flex-end;':''">
            <svg-icon class="icon" :name="index===currIndex?'listPause':'listPlay'" />
            <svg-icon class="icon" name="love-line" />
            <svg-icon class="icon" name="more" />
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Drawer } from 'ant-design-vue'
import '@lottiefiles/lottie-player'
import playAnimation from '@/assets/lottie/sonicWave.json'
export default defineComponent({
  name: 'ListDrawer',
  components: {
    Drawer
  },
  props: {
    isShowDrawer: {
      type: Boolean
    }
  },
  setup(props, ctx) {
    const store = useStore()
    const selectIndex = ref(-1)
    const player = ref()
    const musicList = computed(() => store.state.musicList)
    const currIndex = computed(() => store.state.currMusic?.index)

    const selectItem = (index:number) => {
      selectIndex.value = index
    }
    const switchMusic = (index:number) => {
      if (currIndex.value !== index) {
        store.commit('setCurrMusic', musicList.value[index])
      }
    }
    const closeDrawer = () => {
      ctx.emit('closeDrawer')
    }

    const timeFormat = (time:number) => {
      const timeM = time / 60
      const timeS = time % 60
      let timeMinute = ''
      let timeSeconds = ''
      if (timeM < 10) {
        timeMinute = `0${timeM}`
      } else {
        timeMinute = `${timeM}`
      }
      if (timeS < 10) {
        timeSeconds = `0${timeS}`
      } else {
        timeSeconds = `${timeS}`
      }
      timeMinute = timeMinute.substr(0, 2)
      timeSeconds = timeSeconds.substr(0, 2)
      return `${timeMinute}:${timeSeconds}`
    }

    const state = computed(() => store.state.audio.state)

    watch(state, () => {
      if (state.value) {
        player.value?.play()
      } else {
        player.value?.pause()
      }
    })

    watch(props, () => {
      if (!props.isShowDrawer) {
        selectIndex.value = -1
      }
    })

    watch(currIndex, () => {
      let container:any = document.getElementById('listContainer')
      if (container) {
        container = container.children[1].children[0].children[0]
        if (container.scrollHeight > container.clientHeight) {
          const unit = container.scrollHeight / musicList.value.length
          container.scrollTo({ left: 0, top: (unit * currIndex.value) - (container.clientHeight / 2), behavior: 'smooth' })
        }
      }
    })

    onMounted(() => {
      let container:any = document.getElementById('listContainer')
      if (container) {
        container = container.children[1].children[0].children[0]
        if (container.scrollHeight > container.clientHeight) {
          const unit = container.scrollHeight / musicList.value.length
          container.scrollTo({ left: 0, top: (unit * currIndex.value) - (container.clientHeight / 2), behavior: 'smooth' })
        }
      }
    })

    return {
      player,
      playAnimation,
      selectIndex,
      musicList,
      currIndex,
      selectItem,
      switchMusic,
      closeDrawer,
      timeFormat
    }
  }
})
</script>

<style scoped>
::v-deep .ant-drawer-body{
  padding: 0;
}
::v-deep .ant-drawer.ant-drawer-open .ant-drawer-mask {
  height: 100%;
  background: transparent;
}
.item{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  width: 100%;
}
.info{
  display: flex;
  flex-direction: column;
  width: 100%;
}
.icons{
  display: none;
  color: #575757;
}
.duration{
  font-size: 12px;
  color: #b3b2b2;
}
.icon{
  margin: 0 5px;
  font-size: 20px;
}
.item:hover{
  background: #efefef;
}
.item:hover .info{
  width: 60%;
}
.item:hover .icons{
  width: 40%;
  display: flex;
  justify-content: flex-end;
}
.item:hover .duration{
  width: 0;
  display: none;
}
.musicName {
  font-size: 14px;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  display:block;
}
.artistName {
  font-size: 12px;
  color: #8e8e8e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  display:block;
}
</style>
