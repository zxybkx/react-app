import * as service from '../services/global';
import _ from 'lodash';

export default {
  namespace: 'global',

  state: {
  },

  subscriptions: {},


  effects: {
    *getMobileToken({payload}, {call, put}) {
      return yield call(service.getMobileToken, payload);
    },
    *fetchMobileUser({payload}, {call, put}) {
      return yield call(service.fetchMobileUser, payload);
    },
  },

  reducers: {
    changeState(state, action) {
      return {...state, ...action.payload};
    },
  },
};
