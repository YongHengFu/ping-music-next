<template>
  <div>
    <div>
      <span class="h2">精选专辑<RightOutlined /></span>
    </div>
    <div v-if="list.length>0">
      <div v-for="n of 2" :key="n">
        <Block
          v-for="m of blockNum"
          :key="m"
          style="display: inline-block;margin: 10px"
          :content="list[(m-1)+(blockNum*(n-1))]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import Block from './block.vue'
import { getPlayList_Qua } from '../api/music'
export default defineComponent({
  name: 'BlockList',
  components: {
    RightOutlined,
    Block,
  },
  data() {
    return {
      list: [],
      param: {},
    }
  },
  computed: {
    blockNum: function() {
      return this.$store.state.blockNum
    },
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.param = { before: '', limit: 12 }
      getPlayList_Qua(this.param).then((res) => {
        if (res.code === 200) {
          this.list = res.playlists
        }
      })
    },
  },
})
</script>

<style scoped>

</style>
