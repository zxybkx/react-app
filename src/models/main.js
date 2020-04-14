import  Session from '@/utils/session';
import router from 'umi/router';
import * as service from '../services/main';

export default {
  namespace: 'main',

  state: {},

  subscription: {},

  effects: {
    *getPoint({payload}, {select, call, put}){
      return yield call(service.getPoint, payload)
    },
  }
}
