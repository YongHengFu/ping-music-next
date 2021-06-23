<template>
  <div
    :id="'progress-bar'+originKey"
    class="progress-bar"
    @click="jumpPoint($event)"
    @mouseenter="isPoint=true"
    @mouseleave="isPoint=false"
  >
    <div class="duration" />
    <div class="buffered" :style="`right: ${(1- buffDura / totalDura) * 100}%`" />
    <div class="currentTime" :style="currStyle" />
    <Tooltip placement="top" :title="sliderFormat" :arrow-point-at-center="true">
      <div
        v-show="!active||isPoint"
        class="point"
        :style="currStyle"
        @mousedown="mousedown($event)"
        @mouseenter="isTip=true"
        @mouseleave="isTip=false"
      />
    </Tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { Tooltip } from 'ant-design-vue'
export default defineComponent({
  name: 'ProgressBar',
  components:{
    Tooltip
  },
  props: {
    originKey: {
      type: String
    }
  },
  setup(props, ctx) {
    const store = useStore()
    const active = ref(true)
    const isPoint = ref(false)
    const isTip = ref(false)
    const currStyle = ref('')
    const tipTime = ref(0)
    let move = 0

    const currentDura = computed(() => store.state.audio.currentTime)
    const totalDura = computed(() => store.state.audio.duration)
    const buffDura = computed(() => store.state.audio.buffered)
    const sliderFormat = computed(() => timeFormat(tipTime.value))

    watch(currentDura, () => {
      if (active.value) {
        move = ((1 - (currentDura.value / totalDura.value)) * 100)
        tipTime.value = currentDura.value
        currStyle.value = `right: ${move}%`
      }
    })

    const jumpPoint = (e:any) => {
      const pro = document.getElementById('progress-bar' + props.originKey)
      if (pro !== null) {
        const width = pro.offsetWidth
        const X = pro.offsetLeft
        const param = { prop: 'jump', value: ((e.x - X) / width) * totalDura.value }
        store.commit('setAudio', param)
      }
    }

    const mousedown = (e:any) => {
      active.value = false
      function move(el:any) {
        const pro = document.getElementById('progress-bar' + props.originKey)
        if (pro !== null) {
          const width = pro.offsetWidth
          const X = pro.offsetLeft
          let moveWidth = (1 - ((el.x - X) / width)) < 0 ? 0 : (1 - ((el.x - X) / width))
          moveWidth = (1 - ((el.x - X) / width)) > 1 ? 1 : moveWidth
          currStyle.value = `right: ${moveWidth * 100}%`
          tipTime.value = (1 - moveWidth) * totalDura.value
        }
      }

      document.onmousemove = move
      document.onmouseup = function() {
        if (!active.value) {
          active.value = true
          const param = { prop: 'jump', value: tipTime.value }
          store.commit('setAudio', param)
        }
        document.onmousemove = null
        document.onmouseup = null
      }
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
    return {
      active,
      isPoint,
      isTip,
      currStyle,
      buffDura,
      totalDura,
      sliderFormat,
      jumpPoint,
      mousedown
    }
  }
})
</script>

<style scoped>
.progress-bar{
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 12px;
  position: relative;
  z-index: 0;
  padding: 0;
}
.duration{
  height: 3px;
  background: #cccccc;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
}
.buffered{
  height: 3px;
  background: #999999;
  position: absolute;
  left: 0;
  right: 20%;
  z-index: 2;
}
.currentTime{
  background: var(--primary-color);
  height: 3px;
  box-shadow:10px 0 20px -10px blue;
  position: absolute;
  left: 0;
  right: 100%;
  z-index: 4;
}
 .point{
  cursor: pointer;
  width: 12px;
  height: 12px;
  border: var(--primary-color) solid 1px;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 0 0 10px var(--primary-color);
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translate(50%,-50%);
  z-index: 5;
  animation: point-shadow 1.5s infinite alternate-reverse linear;
}
@keyframes  point-shadow {
  0% {
    box-shadow: 0 0 1px var(--primary-color);
  }
  50% {
    box-shadow: 0 0 5px 2px var(--primary-color);
  }
  100% {
    box-shadow: 0 0 5px 3px var(--primary-color);
  }
}
</style>
