import axios from 'axios'
import { message } from 'ant-design-vue'
import store from '@/store'
import Cookie from 'js-cookie'

const service = axios.create({
  baseURL: (import.meta.env.VITE_APP_BASE_URL) as string,
  timeout: 10000,
  withCredentials: true
})
service.interceptors.request.use((config) => {
  const lastTime = Number(localStorage.getItem('lastTime'))
  const nowTime = new Date().getTime()
  if (lastTime) {
    if ((nowTime - lastTime) / 60000 > 30) {
      store.commit('setRefreshLogin', true)
    }
  }
  localStorage.setItem('lastTime', nowTime + '')

  if (config.method === 'post') {
    config.data = {
      ...config.data,
      timestamp: new Date().getTime(),
      cookie: `MUSIC_U=${Cookie.get('MUSIC_U')};`
    }
  } else if (config.method === 'get') {
    config.params = {
      ...config.params,
      timestamp: new Date().getTime(),
      cookie: `MUSIC_U=${Cookie.get('MUSIC_U')};`
    }
  }
  return config
}, (error) => Promise.reject(error))

service.interceptors.response.use(

  (response: { data: any; }) => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    /*    if (res.code !== 200) {
      message.error('网络异常，请重试！')

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 508 || res.code === 512 || res.code === 514) {
        message.error('网络异常，请重试！')
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }*/
    return res
  },
  (error: { message: any; }) => {
    console.log(`err${error}`) // for debug
    message.error('网络异常，请重试！')
    return Promise.reject(error)
  }
)

export default service
