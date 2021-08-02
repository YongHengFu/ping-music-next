<template>
  <div>
    <div class="cover" @click="onOpen">
      <Image
        :src="image+'?param=960y540'"
        :play-icon="true"
        :animation="2"
        :type="0"
        class="image"
        style="border-radius: 8px"
        @play="onOpen"
      />
    </div>
    <span class="title">{{ text??'' }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'MaxCover',
  props: {
    image: String,
    text: String,
    videoId: String,
    type: String
  },
  setup(props, ctx) {
    const router = useRouter()
    const onOpen = () => {
      router.push('/videoPlayer/' + props?.type + '/' + props?.videoId)
    }
    return {
      onOpen
    }
  }
})
</script>

<style scoped>
.cover{
  width: calc((var(--page-width) - 60px) / 4);
  height: calc(((var(--page-width) - 60px) / 4) * (9 / 16));
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
