import { BASE_URL, TIMEOUT } from './env';
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { set } from "lodash";

// 定义响应数据的通用结构
// interface ApiResponse<T> {
//   code: number;
//   msg: string;
//   data: T;
// }


set(axios.defaults.headers, "Content-Type", "application/json;charset=utf-8");

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: BASE_URL, // API 的 base_url
  timeout: TIMEOUT, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做一些处理，例如添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 处理响应数据
    const res = response.data;
    if (res.code !== 'ok') {
      message.warning(res.msg)
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error: any) => {
    if (error.status === 401) {
      window.location.href = '/login'; // 重定向到登录页面
      return Promise.reject(new Error(error.response.data.msg || 'Error'));
    }
    // 处理响应错误
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

const GET = <T = any, R = T, D = any>(
  url: string,
  config?: (AxiosRequestConfig<D> & { cache?: boolean }) | undefined,
): Promise<R> => {
  return service.get<T, R, D>(url, config);
};
const POST = <T = any, R = T, D = any>(
  url: string,
  data?: D | undefined,
  config?: (AxiosRequestConfig<D> & { cache?: boolean }) | undefined,
): Promise<R> => {
  return service.post<T, R, D>(url, data, config);
};

Object.assign(service, {
  GET,
  POST
});
export default service as AxiosInstance & {
  GET: typeof GET;
  POST: typeof POST;
};
