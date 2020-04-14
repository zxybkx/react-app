import { stringify } from 'qs';
import request from '@/utils/request';

const dev = process.env.NODE_ENV === 'development';
const defaultHost = 'https://hmj.jahwaec.com';

// 请求地址是当前访问地址
const currentHost = () => {
  if (dev || /^[\d]|localhost/.test(window.location.host)) return defaultHost;
  return `${window.location.origin}`;
};

// console.log('环境变量', currentHost());
// 自定义前缀，对应后端微服务
const apiUrlfun = val => {
  if (val) {
    return `${currentHost()}/api/${val}`;
  }
  return `${currentHost()}/api`;
};

export { stringify, apiUrlfun, request };
