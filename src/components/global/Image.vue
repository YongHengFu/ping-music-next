<template>
  <div class="container" :class="{'move-up':animation===1}" :style="{'border-radius':borderRadius}">
    <img :src="imageUrl" class="content" :class="{'enlarge':animation===2}" :style="{'border-radius':borderRadius}" @error="fallback">
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import cover from '@/assets/image/cover.png'
import avatar from '@/assets/image/avatar.png'

export default defineComponent({
  name: 'Image',
  props: {
    src: String,
    radius: String,
    type: Number,
    animation: Number
  },
  setup(props) {
    // const fallback = ref('')
    const imageUrl = ref(props.src)
    const borderRadius = ref('0')
    watch(props, () => {
      if (props.src === '') {
        fallback()
      } else {
        imageUrl.value = props.src
      }
    })
    if (props.radius) {
      borderRadius.value = props.radius
    }
    const fallback = () => {
      if (props.type === undefined) {
        imageUrl.value = ''
        return
      }
      switch (props.type) {
        case 0:
          imageUrl.value = cover
          break
        case 1:
          imageUrl.value = avatar
          break
        default:
          imageUrl.value = cover
      }
    }
    return {
      imageUrl,
      borderRadius,
      fallback
    }
  }
})
</script>

<style scoped>
.container{
  width: 100%;
  overflow: hidden;
  transition: transform 0.5s;
}
.content{
  width: 100%;
  transition: transform 0.5s;
}
.move-up:hover{
  transform: translateY(-10px);
}
.enlarge:hover{
  transform: scale(1.2);
}
</style>
