<template>
  <img :src="imageUrl" class="image" :style="{'border-radius':borderRadius}" @error="fallback">
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
    type: Number
  },
  setup(props) {
    // const fallback = ref('')
    const imageUrl = ref(props.src)
    const borderRadius = ref('0')
    watch(props, () => {
      debugger
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
.image{
  width: 100%;
}
</style>
