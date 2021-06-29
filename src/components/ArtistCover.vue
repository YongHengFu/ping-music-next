<template>
  <div class="artist-cover">
    <Image
      :src="image+'?param=500y500'"
      :type="0"
      radius="50%"
      class="image"
      @click="openArtist"
    />
    <span>{{ text??'test' }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'ArtistCover',
  props: {
    image: String,
    text: String,
    artistId: String
  },
  setup(props, ctx) {
    const router = useRouter()
    const openArtist = (id:string) => {
      if (props?.id) {
        router.push('/artist/' + props.id)
      }
    }

    return {
      openArtist
    }
  }
})
</script>

<style scoped>
.artist-cover{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.image{
  width: var(--block-size);
  height: var(--block-size);
  border: 1px #999999 dashed;
  cursor: pointer;
}
.image:hover{
  transition: 1s;
  transform: rotate(360deg);
}
</style>
