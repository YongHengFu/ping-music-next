<template>
  <div>
    <div class="cover" @click="onOpen">
      <Image
        :src="image+'?param=500y500'"
        :type="0"
        :animation="2"
        :play-icon="true"
        class="image"
        style="border-radius: 8px"
        @play="onPlay"
      />
      <!--      <div class="play" @click.stop="onPlay">-->
      <!--        <svg-icon name="play-fill" class="play-icon" />-->
      <!--        <Image :src="image+'?param=500y500'" :type="0" class="mask" />-->
      <!--      </div>-->
    </div>
    <span class="title">{{ text??'forever' }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MaxCover',
  props: {
    image: String,
    text: String
  },
  setup(props, ctx) {
    const onOpen = () => {
      ctx.emit('open')
    }
    const onPlay = () => {
      ctx.emit('play')
    }
    return {
      onOpen,
      onPlay
    }
  }
})
</script>

<style scoped>
.cover{
  width: var(--block-size);
  height: var(--block-size);
  cursor: pointer;
}
.title{
  font-size: 14px;
  width: var(--block-size);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
  display:block;
}
</style>
