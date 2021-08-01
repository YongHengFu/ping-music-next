<template>
  <div>
    <span class="h2">独家放送</span>
    <div class="private-content-list">
      <div
        v-for="item of privateContentList"
        :key="item.id"
        class="private-content-list-item"
        @click="openMv(item.id)"
      >
        <Image
          :src="item.picUrl"
          :play-icon="true"
          :animation="2"
          :type="0"
          style="border-radius: 8px"
        />
        <span class="title">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getPrivateContentAll } from '@/api/music'

export default defineComponent({
  name: 'PrivateContent',
  setup() {
    const router = useRouter()
    const privateContentList = ref(<any>[])

    const getPrivateContentData = async() => {
      const param = { limit: 51, offset: 0 }
      await getPrivateContentAll(param).then((res:any) => {
        if (res.code === 200) {
          privateContentList.value = res.result
        }
      })
    }

    getPrivateContentData()

    const openMv = (id:string) => {
      router.push('/videoPlayer/mv' + '/' + id)
    }

    return {
      privateContentList,
      openMv
    }
  }
})
</script>

<style scoped>
.private-content-list{
  display: grid;
  grid-template-columns: repeat(3, calc((var(--page-width) - 40px) / 3));
  grid-template-rows: repeat(1, calc(((var(--page-width) - 40px) / 3) * (10 / 27) + 20px));
  grid-gap: 20px 20px;
  margin: 15px 0;
}
.private-content-list-item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
.private-content-list-item .title{
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
</style>
