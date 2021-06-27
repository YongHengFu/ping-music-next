<template>
  <div class="head">
    <div class="cover">
      <Image :src="artist?.cover+'?param=500y500'" :type="0" radius="5px" style="width: 100%" />
    </div>
    <div class="content">
      <div class="info">
        <span class="h1" style="margin-bottom: 0px">{{ artist?.name }}</span>
        <button class="discolour like-button"><svg-icon name="love" /></button>
      </div>
      <div>
        <span class="works">{{ artist?.musicSize }}首歌 • {{ artist?.albumSize }}张专辑 • {{ artist?.mvSize }}支MV</span>
      </div>
      <div>
        <span class="description" :title="artist?.briefDesc">{{ artist?.briefDesc }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getArtistInfo } from '@/api/music'

export default defineComponent({
  name: 'Info',
  props: {
    artistId: String
  },
  setup(props, ctx) {
    const artist = ref({})

    const getArtistIndfoData = () => {
      const param = { id: props?.artistId }
      getArtistInfo(param).then((res) => {
        if (res?.code === 200) {
          artist.value = res?.data?.artist
        }
      })
    }

    onMounted(() => {
      getArtistIndfoData()
    })

    return {
      artist
    }
  }
})
</script>

<style scoped>
.head{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.cover{
  width: 230px;
  border-radius: 15px;
  overflow: hidden;
}
.content{
  width: calc(100% - 300px);
  height: 200px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.works{
  color: #5a5a5a;
  font-weight: bolder;
  font-size: 14px;
}
.description{
  width: 100%;
  font-size: 13px;
  color: #929292;
  padding-right: 40px;
  user-select: none;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
}
.like-button{
  margin-top: 5px;
  width: 35px;
  height: 30px;
  border-radius: 6px;
  font-size: 12px;
  border: none;
  margin-left: 40px;
  outline: none;
  font-weight: bolder;
  color: #1a1a1a;
}
</style>
