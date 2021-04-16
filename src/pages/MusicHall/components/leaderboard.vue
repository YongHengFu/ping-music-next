<template>
  <div v-if="topList.length>0">
    <div class="container">
      <BoardBlock
        v-for="item of topList"
        :key="item.id"
        :data="item"
        class="block"
      />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BoardBlock from '@/components/BoardBlock.vue'
import { getTopList } from '@/api/music'
export default defineComponent({
  name: 'Leaderboard',
  components: {
    BoardBlock
  },
  data() {
    return {
      topList: []
    }
  },
  created() {
    this.getTopListData()
  },
  methods: {
    getTopListData() {
      getTopList().then((res) => {
        if (res.code === 200) {
          this.topList = res.list
        }
      })
    }
  }
})
</script>

<style scoped>
.container{
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.block{
  margin-right: 20px;
}
</style>
