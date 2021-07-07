<template>
  <div class="page-search">
    <span class="h1">关于"{{ keywords }}"搜索结果</span>
    <div>
      <span class="h2">最佳匹配</span>
      <div class="best-match">
        <div v-for="item of bestMatch" :key="item.id" class="best-match-item" @click="open(item.type,item.id)">
          <Image :src="item.image" :typr="1" radius="8px" class="image" :style="item.type===2?'width: 178px':''" />
          <div class="info">
            <span class="text" style="font-size: 18px;font-weight: bolder">{{ item.name }}</span>
            <span class="text">{{ item.subtitle }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MaxCover from '@/components/MaxCover.vue'
import MusicBlock from '@/components/MusicBlock.vue'
import ArtistCover from '@/components/ArtistCover.vue'
import VideoCover from '@/components/VideoCover.vue'
import { searchBestMatch, searchByKeywords } from '@/api/music'
import router from '@/router'
export default defineComponent({
  name: 'Search',
  setup() {
    const route = useRoute()
    const keywords = route.params.keywords
    const bestMatch = ref(<any>[])
    const searchResults:any = ref({
      song: null,
      artist: null,
      album: null,
      playlist: null,
      video: null
    })

    const getBestMatch = () => {
      const param = {
        keywords: keywords
      }
      searchBestMatch(param).then((res:any) => {
        if (res.code === 200) {
          const result = res.result
          if (result?.orders?.length > 0) {
            bestMatch.value.order = result.orders
            const orders = result.orders
            for (const key in orders) {
              if (result[orders[key]]?.length > 0) {
                const first = result[orders[key]][0]
                const item = {
                  id: first?.id,
                  name: first?.name,
                  image: first?.picUrl,
                  subtitle: '',
                  type: -1 // 0:艺人，1：专辑，2：mv，3：歌单
                }
                const nameList = []
                switch (orders[key]) {
                  case 'artist':
                    item.subtitle = '艺人'
                    item.type = 0
                    break
                  case 'album':
                    item.subtitle = '专辑 • ' + first.artist.name
                    item.type = 1
                    break
                  case 'mv':
                    for (const art of first.artists) {
                      nameList.push(art.name)
                    }
                    item.image = first.cover
                    item.subtitle = 'MV • ' + nameList.join('/')
                    item.type = 2
                    break
                  case 'playlist':
                    item.image = first.coverImgUrl
                    item.subtitle = '歌单 • ' + first.creator.nickname
                    item.type = 3
                    break
                }
                item.image = item.image + '?param=300y300'
                bestMatch.value.push(item)
              }
            }
            console.log(bestMatch.value)
          }
        }
      })
    }
    const searchAll = () => {
      const param = {
        keywords: keywords,
        type: 1018
      }
      searchByKeywords(param).then((res:any) => {
        if (res.code === 200) {
          const keys = ['song', 'playList', 'video', 'artist', 'album']
          const result = res.result
          if (result?.orders?.length > 0) {
            for (const key in result.orders) {
              if (keys.indexOf(key) !== -1 && result[key]?.length > 0) {
                searchResults.value[key] = result[key]
              }
            }
          }
        }
      })
    }

    const open = (type:number, id:string) => {
      switch (type) {
        case 0:
          router.push('/artist/' + id)
          break
        case 1:
          router.push('/album/' + id)
          break
        case 2:
          router.push('/artist/' + id)
          break
        case 3:
          router.push('/playlist/' + id)
          break
      }
    }
    onMounted(() => {
      getBestMatch()
      // searchAll()
    })

    return {
      keywords,
      bestMatch,
      open
    }
  }
})
</script>

<style scoped>
.page-search{
  width: var(--page-width);
}
.best-match{
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.best-match-item{
  width: 400px;
  height: 100px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  background: #eaeaea;
  border-radius: 8px;
  margin-right: 30px;
  cursor: pointer;
}
.image{
  width: 100px;
  height: 100px;
  margin-right: 20px;
  object-fit: cover
}
.info{
  display: flex;
  flex-direction: column;
  justify-content: center;
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  /*white-space:nowrap;*/
}
</style>
