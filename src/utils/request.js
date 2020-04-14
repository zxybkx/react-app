import fetch from 'dva/fetch';
import _ from 'lodash';
import store from './store';
import Session from './session';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };

  // 1. UAA认证需要 XSRF-TOKEN
  let headers = {};
  const xsrfToken = store.getCookie('XSRF-TOKEN');
  if (xsrfToken) {
    headers = _.assign({}, headers, { 'X-XSRF-TOKEN': xsrfToken });
  }

  // 2. 响应请求的参数等
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = _.assign({}, headers, {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8;',
        ...newOptions.headers,
      });
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = _.assign({}, headers, {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ...newOptions.headers,
      });
    }
  }

  // 3. 非认证和登录的url请求
  if (!/.*\/auth\/.*/.test(url)) {
    const session = Session.get();
    if (session) {
      const token = session.access_token || session.token;
      if (token && token.length > 0) {
        newOptions.headers = {
          Authorization: `Bearer ${token}`,
          ...newOptions.headers,
        };
      }
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      const total = response.headers.get('x-total-count');
      return response.text().then((text) => {
        // 4.a 无返回值 或者 为空
        if (_.isNil(text) || text.trim().length === 0) {
          return { success: true, data: null, message: '', page: {} };
        }
        // 4.b text ==>json
        let json = null;
        try {
          json = JSON.parse(text);
        } catch (e) {
          return { success: true, data: text, message: '', page: {} };
        }
        // 4.c json 为空
        if (_.isNil(json)) {
          return { success: false, data: {}, message: '', page: {} };
        }

        // 4.c 转换后json 带 suceess  (目前后台不会主动返回这种方式)
        if (json && _.has(json, 'success')) {
          const { success, message, data } = json;
          let page = {};
          if (data && _.isArray(data)) {
            page = {
              total: total ? parseInt(total, 10) : (data ? data.length : 0),
            };
          }
          return { success, data, message, page };
        }
          // 4.d 正常的数据测试
          const data = json;
          let page = {};
          if (data && _.isArray(data)) {
            page = {
              total: total ? parseInt(total, 10) : (data ? data.length : 0),
            };
          }
          return { success: true, data, message: '', page };

      });
    })
    .catch((e) => {
      const status = e.name;
      if (status === 500) {
        const { response } = e;
        return response.text().then((text) => {
          if (/^[\u4e00-\u9fa5]+/.test(text)) {
            const ret = {
              success: false,
              message: text,
              data: null,
            };

            return ret;
          }
          const ret = {
            success: false,
            message: codeMessage[status],
            data: null,
          };
          return ret;
        }).catch(() => {
          const ret = {
            success: false,
            message: codeMessage[status],
            data: null,
          };
          return ret;
        });
      }

      if (status === 401) {
        // dispatch({type: 'login/logout',});
        // return;
      }
      if (status === 403) {
        // dispatch(routerRedux.push('/exception/403'));
        // return;
      }
      if (status <= 504 && status > 500) {
        // dispatch(routerRedux.push('/exception/500'));
        // return;
      }
      if (status >= 404 && status < 422) {
        // dispatch(routerRedux.push('/exception/404'));
      }
      // message.error(codeMessage[status]);
      const ret = {
        success: false,
        message: codeMessage[status],
        data: null,
      };
      return ret;
    });
}
