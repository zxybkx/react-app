import React, { PureComponent } from 'react';
import { Icon, NavBar, WingBlank, WhiteSpace , NoticeBar, TextareaItem, List, Picker } from 'antd-mobile';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import BizIcon from '@/lib/BizIcon';
import { Col, Row, message } from 'antd';
import cus from '@/assets/cus.png';
import styles from './index.less';

@connect((state) => ({
  khbf: state.khbf,
}))
export default class KhbfDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'khbf/getDetail',
      payload: { id },
    }).then(({ success, data, message }) => {
      if (success && data) {
        this.setState({
          data,
        });
      } else {
        message.error(message);
      }
    });
  }

  close = () => {
    router.push('/khbf/list');
  };

  getKhbfList = () => {
    const { data } = this.state;
    router.push({
      pathname: '/khbf/list',
      query: {
        id: data.customerId
      }
    })
  };

  render() {
    const { data } = this.state;

    //与会人员
    const yhry = _.find(data.crmKhgjRies, (item) => {
      return item.type === 1;
    });

    //同行人员
    const txry = _.find(data.crmKhgjRies, (item) => {
      return item.type === 2;
    });

    return (
      <div className={styles.content} style={{marginTop:".89rem"}}>
        <NavBar mode={'light'}
                icon={<Icon type={'left'}/>}
                onLeftClick={() => router.push('/khbf/list')}
                // rightContent={<a onClick={this.close}>关闭</a>}
        >拜访详情</NavBar>
          <div >
            <div style={{background: '#fff', marginTop: 20}}>
              <WingBlank>
                <WhiteSpace size='lg'/>
                <Row>
                  <Col span={24}>
                    <img src={cus} />
                    <span className={styles.title} onClick={this.getKhbfList}>{data.customerName}</span>
                  </Col>
                </Row>
                <WhiteSpace size='lg'/>
                <Row>
                  <Col span={8}>
                    <span className={styles.detailFont}>时间：</span>
                  </Col>
                  <Col span={16} pull={4}>
                    <span className={styles.text}>{data.gjrq && moment(data.gjrq).format('YYYY-MM-DD')}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <span className={styles.detailFont}>与会人员：</span>
                  </Col>
                  <Col span={16} pull={2}>
                    <span className={styles.text}>{yhry && yhry.userName || '无'}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <span className={styles.detailFont}>同行人员：</span>
                  </Col>
                  <Col span={16} pull={2}>
                    <span className={styles.text}>{txry && txry.userName || '无'}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <span className={styles.detailFont} >拜访目的：</span>
                  </Col>
                  <Col span={16} pull={2}>
                    <span className={styles.text}>{data.gjmd || '无'}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <span className={styles.detailFont}>洽谈情况：</span>
                  </Col>
                  <Col span={16} pull={2}>
                    <span className={styles.text}>{data.qtqk || '无'}</span>
                  </Col>
                </Row>
              </WingBlank>
              <NoticeBar icon='备注：'>
                {data.remark || '无'}
              </NoticeBar>
            </div>
          </div>
      </div>
    );
  }
}
