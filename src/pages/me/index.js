import React, { PureComponent } from 'react';
import { Grid, Icon, List, NavBar, WhiteSpace } from 'antd-mobile';
import {Avatar } from 'antd';
import router from 'umi/router';
import BizIcon from '@/lib/BizIcon';
import styles from './index.less';
import { closeFrame } from '@/utils/cordova';
import customer from '@/assets/customer.png';
import agreement from '@/assets/agreement.png';
import business from '@/assets/business.png';
import idea from '@/assets/idea.png';

const { Item: ListItem } = List;
export default class Shop extends PureComponent {
  componentDidMount() {}

  getData = () => {
    return [
      { icon: <img src={customer}/>, text: <span className={styles.ejfontSize}>我的客户</span>, path: '/khbf' },
      { icon: <img src={agreement}/>, text: <span className={styles.ejfontSize}>我的合同</span>, path: '/business' },
      { icon: <img src={business}/>, text: <span className={styles.ejfontSize}>我的商机</span>, path: '/task' },
    ];
  };

  click = data => {
    // router.push(data.path)
  };

  render() {
    const data = this.getData();
    return (
      <div className={styles.contain}>
        <div style={{marginTop:".59rem"}}>
          <div className={styles.top}>
            <BizIcon type='gerenfill' style={{ fontSize: '1.2rem' }}/><br/>
            <span style={{fontWeight: 'bold' ,fontSize: '0.3rem'}}>张天意</span><br/>
            <span className={styles.ejfontSize}>人生自有天意</span>
          </div>
          <WhiteSpace size='lg'/>
          <Grid data={data} columnNum={3} onClick={this.click} hasLine={false}/>
          <ListItem arrow='horizontal' thumb={<BizIcon type='pinglun' style={{ fontSize: '0.4rem' }}/>}>
            <span className={styles.ejfontSize}>意见反馈</span>
          </ListItem>
          <ListItem arrow='horizontal' thumb={<BizIcon type='xinxi' style={{ fontSize: '0.4rem' }}/>}>
            <span className={styles.ejfontSize}>关于科创</span>
          </ListItem>
          <ListItem arrow='horizontal' thumb={<BizIcon type='shezhi' style={{ fontSize: '0.4rem' }}/>}>
            <span className={styles.ejfontSize}>消息设置</span>
          </ListItem>
        </div>
      </div>
    );
  }
}

