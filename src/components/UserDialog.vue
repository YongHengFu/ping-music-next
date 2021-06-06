<template>
  <div class="dialog">
    <p style="text-align: center;padding: 10px;margin:0;cursor: pointer" @click="logout">退出登录</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { logoutAccount } from '@/api/user'
export default defineComponent({
  name: 'UserDialog',
  setup() {
    const store = useStore()
    onMounted(() => {
      setTimeout(() => {
        document.onclick = () => {
          store.commit('setShowDialog', -1)
          document.onclick = null
        }
      }, 100)
    })

    const logout = () => {
      logoutAccount().then((res:any) => {
        if (res.code === 200) {
          store.commit('setLoginState', false)
          localStorage.setItem('userName', '')
          localStorage.setItem('usid', '')
          localStorage.setItem('nickName', '未登录')
          localStorage.setItem('avatarUrl', '')
        }
      })
    }
    return {
      logout
    }
  }
})
</script>

<style scoped>
.dialog{
  box-shadow: 0 0 10px #8d8d8d;
}
</style>
