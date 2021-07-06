<template>
  <div>
    <!--    <span class="h2">正在播放</span>-->
    <!--    <PlayItem-->
    <!--      :list-item="currMusic"-->
    <!--    />-->
    <!--    <span class="h2">历史播放</span>-->
    <PlayItem
      v-for="(item,index) of musicList.slice(1)"
      :id="listId+index"
      :key="item.id"
      :list-item="item"
      :list-id="listId"
      @playSelect="playSelect(item)"
      @dblclick="playSelect(item)"
      @contextmenu="(e)=>showMenu(e,item)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import PlayItem from '@/pages/playList/components/PlayItem.vue'
import { getMusicDetail } from '@/api/music'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'MusicRecords',
  components: {
    PlayItem
  },
  setup() {
    const store = useStore()
    const musicList = ref(<any>[])
    const listId = 'history'

    const currMusic = computed(() => store.state.currMusic)
    const records = computed(() => store.state.records)

    const playSelect = (music:any) => {
      if (music.canPlay.able) {
        for (const item of musicList.value) {
          if (item.id === music.id) {
            store.commit('setCurrMusic', item)
            store.commit('setMusicList', musicList.value)
            return
          }
        }
      } else {
        message.error(music.canPlay.msg)
      }
    }

    onMounted(() => {
      musicList.value = getMusicDetail(records.value, listId)
    })

    return {
      musicList,
      listId,
      currMusic,
      playSelect
    }
  }
})
</script>

<style scoped>

</style>
