import * as service from '../services/common';

export default {
  namespace: 'common',

  state: {
  },

  subscriptions: {},


  effects: {


    *getOrgs({payload}, {call, put}) {
      return yield call(service.getOrgs, payload);
    },

    *getOrgEmps({payload}, {call, put}) {
      return yield call(service.getOrgEmps, payload);
    },

    *searchEmps({payload}, {call, put}) {
      return yield call(service.searchEmps, payload);
    },

  },

  reducers: {
    changeState(state, action) {
      return {...state, ...action.payload};
    },
  },
};
