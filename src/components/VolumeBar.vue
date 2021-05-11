<template>
  <div
    :id="'volumeBar'+originKey"
    class="volumeBar"
    @mouseleave="showPoint"
    @mouseenter="showPoint"
    @click="jumpPoint($event)"
  >
    <div class="countVolume" />
    <div class="currVolume" :style="{'right': right+'%'}" />
    <div
      v-show="!active||isPoint"
      id="point"
      class="point"
      :style="{'right': right+'%'}"
      @mousedown="mousedown"
      @click.stop=""
    />
  </div>
</template>

<script>
import { defineComponent, computed, watch, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'VolumeBar',
  props: {
    originKey: {
      type: String
    }
  },
  setup(props, ctx) {
    const store = useStore()
    const active = ref(true)
    const isPoint = ref(false)
    let volume = 0
    const right = ref(100)
    onMounted(() => {
      right.value = (1 - currVolume.value) * 100
    })
    const currVolume = computed(() => store.state.audio.volume)

    watch(currVolume, () => {
      right.value = (1 - currVolume.value) * 100
      if (currVolume.value === 0) {
        const param = { prop: 'mute', value: true }
        store.commit('setAudio', param)
      }
    })

    const showPoint = () => {
      isPoint.value = !isPoint.value
    }
    const jumpPoint = (e) => {
      const offsetLeft = getElementLeft(document.getElementById('volumeBar' + props.originKey))
      right.value = (1 - (e.x - offsetLeft) / 100) * 100
      right.value = right.value < 0 ? 0 : right.value
      right.value = right.value > 100 ? 100 : right.value
      volume = 1 - right.value / 100
      const param = { prop: 'volume', value: volume }
      store.commit('setAudio', param)
    }
    const getElementLeft = (element) => {
      let offsetLeft = element.offsetLeft
      const current = element.offsetParent // 获取父元素
      offsetLeft += current.offsetLeft
      return offsetLeft
    }
    const mousedown = () => {
      active.value = false
      function move(e) {
        const offsetLeft = getElementLeft(document.getElementById('volumeBar' + props.originKey))
        right.value = (1 - (e.x - offsetLeft) / 100) * 100
        right.value = right.value < 0 ? 0 : right.value
        right.value = right.value > 100 ? 100 : right.value
        volume = 1 - right.value / 100
      }

      document.onmousemove = move
      document.onmouseup = function() {
        if (!active.value) {
          active.value = true
          const param = { prop: 'volume', value: volume }
          store.commit('setAudio', param)
        }
        document.onmousemove = null
        document.onmouseup = null
      }
    }

    return {
      active,
      right,
      isPoint,
      showPoint,
      jumpPoint,
      mousedown
    }
  }
})
</script>

<style scoped>
.volumeBar{
  cursor: pointer;
  width: 100px;
  height: 3px;
  padding: 8px 0;
  margin-left: 30px;
  border-radius: 30px;
  position: relative;
  z-index: 0;
}
.countVolume{
  cursor: pointer;
  height: 3px;
  background: #cccccc;
  border-radius: 30px;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
}
.currVolume{
  background: var(--primary-color);
  height: 3px;
  border-radius: 20px;
  position: absolute;
  left: 0;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}
.point{
  background: #e7e5e5;
  width: 10px;
  height: 20px;
  border-radius: 40%;
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translate(50%,-50%);
  z-index: 2;
}
</style>
