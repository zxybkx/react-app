import Session from '@/utils/session';
import router from 'umi/router';
import * as service from '../services/product';

export default {
  namespace: 'product',

  state: {},

  subscriptions: {},

  effects: {
    * getProductList({ payload }, { select, call, put }) {
      return yield call(service.getProductList, payload);
    },

    *getDetail({payload}, {select, call, put}) {
      return yield call(service.getDetail, payload);
    },

    *categories({payload}, {select, call, put}) {
      return yield call(service.categories, payload);
    },

    *getPinYin({payload}, {select,call, put}) {
      return yield call(service.getPinYin, payload);
    },

    *addProduct({payload}, {select, call, put}) {
      return yield call(service.addProduct, payload);
    },
  },

  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
