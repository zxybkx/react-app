import  Session from '@/utils/session';
import router from 'umi/router';
import * as service from '../services/business';

export default {
  namespace: 'business',

  state: {},

  subscriptions: {},

  effects: {
    *getDataList({payload}, {select,call,put}) {
      return yield call (service.getDataList, payload)
    },

    *getPinYin({payload}, {select, call, put}) {
      return yield call(service.getPinYin, payload)
    },

    *addBusiness({payload}, {select, call, put}) {
      return yield call(service.addBusiness, payload)
    },

    *getCustomersList({payload}, {select, call, put}) {
      return yield call(service.getCustomersList, payload);
    },

    *getData({payload}, {select, call, put}) {
      return yield call (service.getData, payload);
    }
  },

  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
}
