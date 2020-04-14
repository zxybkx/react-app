import  Session from '@/utils/session';
import router from 'umi/router';
import * as service from '../services/khbf';

export default {
  namespace: 'khbf',

  state: {},

  subscriptions: {},

  effects: {
    *getCustomersList({payload}, {select, call, put}) {
      return yield call(service.getCustomersList, payload);
    },

    *addKhbf({payload}, {select, call, put}) {
      return yield call(service.addKhbf, payload);
    },

    *getKhbfList({payload}, {select, call, put}) {
      return yield call(service.getKhbfList, payload);
    },

    *getDetail({payload}, {select, call, put}) {
      return yield call(service.getDetail, payload);
    },
  },

  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
}
