<template>
  <div class="search-dialog2">
    <div v-if="searchKeyword.length===0">
      <div>
        <span>搜索历史</span>
        <span style="float: right">清空</span>
      </div>
      <span>热门搜索</span>
    </div>
    <div v-else>
      <span>热门搜索</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchDialog',
  props: {
    searchKeyword: String
  },
  setup() {
  }
})
</script>

<style scoped>
.search-dialog2{
  width: 400px;
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  left: 300px;
  top: 50px;
  z-index: 10;
  background: #FFFFFF;
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 10px 15px;
}
</style>
