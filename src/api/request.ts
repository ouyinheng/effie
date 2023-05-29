import Axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// import router from '@/router'
import "muse-ui-message/dist/muse-ui-message.css";
// Axios.defaults.baseURL = process.env.API_ENV
Axios.defaults.timeout = 20000;
Axios.defaults.withCredentials = true;

Axios.interceptors.response.use(
  (resp: AxiosResponse) => {
    // let result = resp.data
    return Promise.resolve(resp.data);
  },
  (error: any) => {
    // const status = error.response.status
    Message.alert(error.response.data.msg, "TIPS");
    return Promise.reject(error);
  }
);
