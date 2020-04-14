import config from '../config';
import Router from 'umi/router';

export const getCurrentUserInfo = (callback) => {
  try {
    cordova.exec(function(result) {
      const user = result.login_user;
      if(callback){
        callback(user);
      }
    }, function(error) {
      alert('调用失败');
    }, 'WorkPlus_Auth', 'getLoginUserInfo', []);
  } catch (e) {
    const {NODE_ENV} = process.env;
    if(NODE_ENV === 'development'){
      return callback(config.get('/tester'));
    }
    return callback(null);
  }
};

export const closeFrame = () => {
  try {
    cordova.exec(
      function(result) {
        alert(JSON.stringify(result, null, 4));
      },
      function(error) {
        alert('调用失败');
      }, 'WorkPlus_WebView', 'exit', []);
  } catch (e) {
    Router.push(`/`);
    return;
  }
};
