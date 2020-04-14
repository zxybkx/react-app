import React, { PureComponent } from 'react';
import { Icon, NavBar, Button, InputItem, TextareaItem, List, Picker, WingBlank, Toast } from 'antd-mobile';
import {Row, Col} from 'antd';
import router from 'umi/router';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import Session from '@/utils/session';
import styles from '../customer/detailForm/index.less';

@connect((state) => ({
  business: state.business,
}))
export default class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    const {dispatch, location: {query: {id}}} = this.props;
    dispatch({
      type: 'business/getData',
      payload: id
    }).then((res) => {
      if(res) {
        const {success, data, message} = res;
        if(success && data) {
          this.setState({data});
          data.errMsg && Toast.fail(data.errMsg,1)
        }
      }
    })
  }

  render () {
    const {data} = this.state;

    return(
      <div>
        <NavBar
          mode='light'
          icon={<Icon type={'left'}/>}
          onLeftClick={() => router.push('/business')}>
          商机详情
        </NavBar>
        <WingBlank>
          <Row>
            <Col span={8}>
              <span className={styles.detailFont}>商机名称：</span>
            </Col>
            <Col span={16} pull={2}>
              <span className={styles.text}>{data.sjmc}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className={styles.detailFont}>预计金额：</span>
            </Col>
            <Col span={16} pull={2}>
              <span className={styles.text}>{data.yjje}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className={styles.detailFont}>商机描述：</span>
            </Col>
            <Col span={16} pull={2}>
              <span className={styles.text}>{data.remark || '无'}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className={styles.detailFont}>商机创建人：</span>
            </Col>
            <Col span={16} pull={1}>
              <span className={styles.text}>{data.sjsyr}</span>
            </Col>
          </Row>
        </WingBlank>
      </div>
    )
  }
}
