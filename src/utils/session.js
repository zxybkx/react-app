import store from './store';

export default class Session {
}

Session.init = function (session) {
  store.add('session', session);
};

Session.destroy = function () {
  store.remove('session');
};

Session.get = function () {
  return store.get('session');
};

Session.set = function (values) {
  const _session = store.get('session') || {};
  const session = Object.assign({}, _session, values);
  store.add('session', session);
};
