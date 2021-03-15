import axios from 'axios';
import { message } from 'ant-design-vue';

const service = axios.create({
  baseURL: '/',
  timeout: 10000,
});
service.interceptors.request.use((config) => config, (error) => Promise.reject(error));

service.interceptors.response.use(

  (response: { data: any; }) => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      message.error('网络异常，请重试！');

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        message.error('网络异常，请重试！');
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error: { message: any; }) => {
    console.log(`err${error}`); // for debug
    message.error('网络异常，请重试！');
    return Promise.reject(error);
  },
);

export default service;
