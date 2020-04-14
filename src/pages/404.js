
import React, { PureComponent } from 'react';
import { Button, NoticeBar } from 'antd-mobile';
import { closeFrame } from '@/utils/cordova';

export default class Shop extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div>
        <NoticeBar icon={null}>
          页面还在建设中
        </NoticeBar>
        <Button type="primary" onClick={closeFrame}>
          退出
        </Button>
      </div>
    );
  }
}

