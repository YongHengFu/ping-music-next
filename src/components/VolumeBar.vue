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
      v-show="!state||isPoint"
      id="point"
      class="point"
      :style="{'right': right+'%'}"
      @mousedown="mousedown()"
      @click.stop=""
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'VolumeBar',
  props: {
    originKey: {
      type: String
    }
  },
  data() {
    return {
      state: true,
      isPoint: false,
      volume: 0,
      volumeStyle: '',
      right: 100
    }
  },
  computed: {
    currVolume() {
      return this.$store.state.audio.volume
    }
  },
  watch: {
    currVolume() {
      this.right = (1 - this.$store.state.audio.volume) * 100
    },
    volume() {
      if (this.volume === 0) {
        const param = { prop: 'mute', value: true }
        this.$store.commit('setAudio', param)
      }
    }
  },
  mounted() {
    this.right = (1 - this.$store.state.audio.volume) * 100
  },
  methods: {
    showPoint() {
      this.isPoint = !this.isPoint
    },
    jumpPoint(e) {
      const offsetLeft = this.getElementLeft(document.getElementById('volumeBar' + this.originKey))
      this.right = (1 - (e.x - offsetLeft) / 100) * 100
      this.right = this.right < 0 ? 0 : this.right
      this.right = this.right > 100 ? 100 : this.right
      this.volume = 1 - this.right / 100
      const param = { prop: 'volume', value: this.volume }
      this.$store.commit('setAudio', param)
    },
    getElementLeft(element) {
      let offsetLeft = element.offsetLeft
      const current = element.offsetParent // 获取父元素
      offsetLeft += current.offsetLeft
      return offsetLeft
    },
    mousedown() {
      this.state = false
      const this_ = this
      function move(e) {
        const offsetLeft = this_.getElementLeft(document.getElementById('volumeBar' + this_.originKey))
        this_.right = (1 - (e.x - offsetLeft) / 100) * 100
        this_.right = this_.right < 0 ? 0 : this_.right
        this_.right = this_.right > 100 ? 100 : this_.right
        this_.volume = 1 - this_.right / 100
      }
      window.addEventListener('mousemove', move, false)

      window.addEventListener('mouseup', async function(el) {
        await window.removeEventListener('mousemove', move, false)
        if (!this_.state) {
          this_.state = true
          const param = { prop: 'volume', value: this_.volume }
          this_.$store.commit('setAudio', param)
        }
      }, false)
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
