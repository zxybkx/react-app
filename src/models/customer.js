import  Session from '@/utils/session';
import router from 'umi/router';
import * as service from '../services/customer';

export default {
  namespace: 'customer',

  state: {},

  subscriptions: {},

  effects: {
    *addCustomer({payload}, {select, call, put}) {
      return yield call(service.addCustomer, payload);
    },

    *validateKhmc({payload}, {select, call, put}) {
      return yield call(service.validateKhmc, payload);
    },

    *getDataList({payload}, {select, call ,put}) {
      return yield call(service.getDataList, payload);
    },

    *getOptions({payload}, {select, call, put}) {
      return yield call(service.getOptions, payload);
    },

    *saveEditCustomer({payload}, {select, call, put}) {
      return yield call(service.saveEditCustomer, payload);
    },

    *saveAddCustomer({payload}, {select, call, put}) {
      return yield call(service.saveAddCustomer, payload);
    },

    *editCustomer({payload}, {select, call, put}) {
      return yield call(service.editCustomer, payload);
    },

    *getDetail({payload}, {select, call, put}) {
      return yield call(service.getDetail, payload);
    },

    * changeKhzt({ payload }, { select, call, put }) {
      return yield call(service.changeKhzt, payload);
    },

    * getKhzzOptions({ payload }, { select, call, put }) {
      return yield call(service.getKhzzOptions, payload);
    },

    * getKhbm({ payload }, { select, call, put }) {
      return yield call(service.getKhbm, payload);
    },

  },

  reducers: {
    changeState(state, action) {
      return { ...state, ...action.payload };
    },
  },
}
