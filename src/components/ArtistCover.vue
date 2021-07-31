<template>
  <div class="artist-cover">
    <Image
      :src="image+'?param=300y300'"
      :type="0"
      :animation="2"
      radius="50%"
      class="image"
      @click="openArtist"
    />
    <span>{{ text??'' }}</span>
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
      if (props?.artistId) {
        router.push('/artist/' + props.artistId)
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
  width: calc(var(--block-size) - 10%);
  height: calc(var(--block-size) - 10%);
  object-fit: cover;
  cursor: pointer;
}
</style>
