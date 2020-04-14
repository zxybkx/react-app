import BasicLayout from './BasicLayout';
import BlankLayout from './BlankLayout';
import UserLayout from './BlankLayout';
import _ from 'lodash';
import { layoutConfig } from '@/layouts/config';
import { PureComponent } from 'react';
import jwt from 'jsonwebtoken';
import { getCurrentUserInfo } from '@/utils/cordova';
import { connect } from 'dva';
import Session from '@/utils/session';
import { reloadAuthorized } from '@/utils/Authorized';
import PageLoading from '@/lib/PageLoading';
import browser from 'browser-detect';

@connect()
export default class Layout extends PureComponent {

  state = {
    loading: true,
  };

  componentDidMount() {
    const result = browser();

    if (!(result && result.mobile)) {
      // this.initSession();
    } else {
      if(/workplus/.test(window.navigator.userAgent)) {
        document.addEventListener('deviceready', () => {
          // this.initSession();
        }, false);
      }else{
        // this.initSession();
      }
    }
  }

  initSession() {
    const session = Session.get();
    getCurrentUserInfo(user => {
      if (!user) {
        return false;
      }
      if (!session) {
        this.doLogin(user);
      } else {
        if (session.username !== user.username) {
          this.doLogin(user);
        } else {
          this.setState({ loading: false });
        }
      }
    });
  }

  doLogin = user => {
    const { dispatch } = this.props;
    dispatch({
      type: `global/getMobileToken`,
      payload: {
        username: user.username,
        token: '553a425dacd87ad90f53af07dd5e3484',
      },
    }).then(({ success, data }) => {
      if (success) {
        if (data.id_token === 'ERROR') {
          status = 'error';
        } else {
          status = 'ok';
          const decoded = jwt.decode(data.id_token);
          if (decoded) {
            const { auth, name, username, gh } = decoded;
            user = { name, username, gh, roles: auth.split(','), access_token: data.id_token };
            Session.init(user);
            dispatch({
              type: 'user/getCurrentEmployeeDetail',
            }).then(({ data, success }) => {
              if (success) {
                user = Object.assign({}, user, data);
                Session.init(user);
              }
            });
          } else {
            status = 'error';
          }
        }
      }

      if (status === 'ok') {
        Session.init(user);
        dispatch({
          type: 'user/fetchCurrent',
        });
        reloadAuthorized();
        this.setState({ loading: false });
      }
    });
  };

  render() {
    // return this.state.loading ? <PageLoading/> : this.renderComponent();
    return this.state.loading ? this.renderComponent() : <PageLoading/>;
  }

  renderComponent() {
    const { props } = this;

    let layout;

    const { location } = props;
    let { pathname, query } = location;
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    let type = layoutConfig[pathname];
    if (!type) {
      type = _.find(layoutConfig, (v, k) => new RegExp(k).test(pathname));
    }
    if (type) {
      switch (type) {
        case 'blank':
          layout = <BlankLayout {...props} />;
          break;
        case 'user':
          layout = <UserLayout {...props} />;
          break;
        default:
          layout = <BlankLayout {...props} />;
          break;
      }
    } else if (query.q && query.q === 'w') {
      // q=w 内嵌页面 直接渲染
      layout = <BlankLayout {...props} />;
    } else {
      layout = <BasicLayout {...props} />;
    }

    return layout;
  }

}
