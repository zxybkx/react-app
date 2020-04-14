import React, { PureComponent } from 'react';
import { Grid, Icon, NavBar } from 'antd-mobile';
import router from 'umi/router';
import BizIcon from '@/lib/BizIcon';
import { closeFrame } from '@/utils/cordova';

export default class Shop extends PureComponent {
  componentDidMount() {}

  getData = () => {
    return [
      {icon: <BizIcon type='daibanshixiang' style={{fontSize: '0.6rem'}}/>, text: '日程', path: '/me'},
    ];
  };

  click = data => {
    router.push(data.path)
  };

  render() {
    const data = this.getData();
    return (
      <div style={{marginTop:".89rem"}}>
        <NavBar
          mode="light"
          leftContent={<a style={{color: '#444'}} onClick={closeFrame}><Icon type='left'/></a>}>
          待办任务
        </NavBar>
        <span style={{color: '#cecece', fontSize: '0.34rem'}}>开发中……</span>
      </div>
    );
  }
}

