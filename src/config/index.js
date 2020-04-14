import commConfig from './config';
import devConfig from './config.dev';
import prodConfg from './config.prod';

const config = process.env.NODE_ENV ==='development' ?
  _.assign({}, commConfig, devConfig) : _.assign({}, commConfig, prodConfg);
const Config = {
  get: key => {
    if (key !== '/') {
      let newkey = key.replace(/\/+/g, '/');
      newkey = newkey.replace(/^\//i, '');
      newkey = newkey.replace(/\/$/, '');
      const keys = newkey.split('/');
      const value = keys.reduce((json, k) => {
        return json[k];
      }, config);
      return value;
    }
    return '';
  },
};

module.exports = Config;
