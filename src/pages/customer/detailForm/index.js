import React, { PureComponent, Component, Fragment } from 'react';
import {
  Icon,
  NavBar,
  Card,
  WhiteSpace,
  Accordion,
  WingBlank,
  List,
  Popover,
  InputItem,
  Picker,
  DatePicker,
  Toast,
  TextareaItem,
} from 'antd-mobile';
import router from 'umi/router';
import PageLayout from '@/layouts/BasicLayout';
import { connect } from 'dva';
import { Col, Row, message } from 'antd';
import styles from './index.less';
import moment from 'moment';
import cus from '@/assets/cus.png';
import _ from 'lodash';

const Panel = Accordion.Panel;
@connect((state) => ({
  customer: state.customer,
}))

export default class DetailModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      selectData: {},
      khxzOptions: []
    };
  }

  componentDidMount() {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'customer/getDetail',
      payload: id,
    }).then((response) => {
      if (response) {
        const { data, success, message } = response;
        if (success && data) {
          this.setState({ data });
        } else {
          Toast.fail(message, 1);
        }
      }
    });

    // 客户性质选项
    dispatch({
      type: 'customer/getKhzzOptions',
      payload: {
        name: 'khxx-khxz',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          khxzOptions: data,
        });
      }
    });

    //企业类型选项
    dispatch({
      type: 'customer/getOptions',
    }).then(({success, data}) => {
      if (success && data) {
        this.setState({
          selectData: data
        })
      }
    });
  }

  //将UTC时间转换为年月日时分秒
  timeStamp = (value) => {
    if (value != null) {
      const date = new Date(value);
      let Y = date.getFullYear();
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      let D = date.getDate();

      if (Y === '1970') {
        return '无';
      } else {
        return Y + '-' + M + '-' + D;
      }
    } else {
      return '无';
    }
  };

  render() {
    const { data,selectData, khxzOptions } = this.state;
    const title = (
      <div>
        <div style={{ marginBottom: '8px', lineHeight: '2' }}>
          <img src={cus} />
          {data.khmc}
        </div>
        <div style={{ fontSize: '0.30rem', color: '#A6A6A6' }}>地址：{data.txdz || '无'}</div>
      </div>
    );

    // const khxz = _.find(khxzOptions, item => item.useName === )

    const qylxItem = _.find(selectData.mdDictionaryItems, item => {
      if (!_.isEmpty(data)) {
        return (item.code === 'enterprise_type' && item.itemValue === data.extraQylx);
      }
    });

    // 客户类别
    const khlbOptions = require('../../../data/khlb.json');
    const khlbej = data.khlb && _.find(khlbOptions[0].children, i =>{
      return i.value = _.split(data.khlb, '/')[1]
    });
    const khlb = khlbej ? '按贸易分类/'+ `${khlbej.label}` : '无';

    return (
      <div>
        <NavBar
          mode='light'
          icon={<Icon type={'left'}/>}
          onLeftClick={() => router.push('/customer')}>
          客户详情
        </NavBar>
        <div style={{backgroundColor: '#eee'}}>
          <div style={{padding: '10px'}}>
            <Card>
              <Card.Header title={title}/>
            </Card>
          </div>
        </div>
        <WhiteSpace/>
        <Accordion accordion defaultActiveKey="0">
          <Panel header='基本信息'>
            <WingBlank>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>客户性质：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.khxzmc || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>客户类别：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{khlb}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>英文名称：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.khywm || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>企业简称：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.khjc || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>企业性质：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.extraQyxz || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>公司网址：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.extraGsWz || '无'}</span>
                </Col>
              </Row>
            </WingBlank>
          </Panel>
          <Panel header='工商信息'>
            <WingBlank>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>法人代表：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.fddbr || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>注册资本：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.extraZczb || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <span className={styles.detailFont}>统一社会编码：</span>
                </Col>
                <Col span={14} pull={2}>
                  <span className={styles.text}>{data.shxydm || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>成立日期：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span
                    className={styles.text}>{data.extraGsClsj && moment(data.extraGsClsj).format('YYYY-MM-DD') || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <span className={styles.detailFont}>营业执照注册码：</span>
                </Col>
                <Col span={14}>
                  <span className={styles.text}>{data.yyzzZch || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>纳税登记号：</span>
                </Col>
                <Col span={16} pull={1}>
                  <span className={styles.text}>{data.nsdjh || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <span className={styles.detailFont}>组织机构代码：</span>
                </Col>
                <Col span={14} pull={2}>
                  <span className={styles.text}>{data.zzjgdm || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>行业：</span>
                </Col>
                <Col span={16} pull={4}>
                  <span className={styles.text}>{data.hylb || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <span className={styles.detailFont}>营业执照年审日期：</span>
                </Col>
                <Col span={13} >
                  <span className={styles.text}>{data.extraYyzzNsrq && moment(data.extraYyzzNsrq).format('YYYY-MM-DD') || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>企业类型：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{qylxItem ? qylxItem.itemName : '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <span className={styles.detailFont}>一般纳税人成立日期：</span>
                </Col>
                <Col span={12} >
                  <span className={styles.text}>{data.extraYbnsrClsj && moment(data.extraYbnsrClsj).format('YYYY-MM-DD') || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>员工人数：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.extraYgrs || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>经营范围：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.extraJyfw || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>详细地址：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.extraZcdz || '无'}</span>
                </Col>
              </Row>
            </WingBlank>
          </Panel>
          <Panel header='其他'>
            <WingBlank>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>总经理：</span>
                </Col>
                <Col span={16} pull={3}>
                  <span className={styles.text}>{data.extraZjl || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>联系电话：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.lxdh || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>账户名称：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.zhmc || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>账户号码：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.zhhm || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>开户银行：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.khyhmc || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>传真：</span>
                </Col>
                <Col span={16} pull={4}>
                  <span className={styles.text}>{data.cz || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>邮编：</span>
                </Col>
                <Col span={16} pull={4}>
                  <span className={styles.text}>{data.yb || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>邮箱：</span>
                </Col>
                <Col span={16} pull={4}>
                  <span className={styles.text}>{data.email || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>业务主办人：</span>
                </Col>
                <Col span={16} pull={1}>
                  <span className={styles.text}>{data.extraYwzbr || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>厂房情况：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.extraCfqk || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <span className={styles.detailFont}>集团战略客户：</span>
                </Col>
                <Col span={14} pull={2}>
                  <span className={styles.text}>{data.extraCfqk || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>客户隶属：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.khls || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>单位类别：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.dwlb || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>信用类别：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.xylb || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>邓氏编码：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.dsbm || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>数据密级：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.sjmj || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <span className={styles.detailFont}>办公场所或厂房占地面积：</span>
                </Col>
                <Col span={8} pull={2}>
                  <span className={styles.text}>{data.extraZdmj || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <span className={styles.detailFont}>主资产是否抵押：</span>
                </Col>
                <Col span={14}>
                  <span className={styles.text}>{data.extraZyzcSfdy || '无'}</span>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <span className={styles.detailFont}>内部客户：</span>
                </Col>
                <Col span={16} pull={2}>
                  <span className={styles.text}>{data.sfNbkh || '无'}</span>
                </Col>
              </Row>
              {
                data.sfNbkh === '是' ?
                  <div>
                    <Row>
                      <Col span={10}>
                        <span className={styles.detailFont}>所属三级单位：</span>
                      </Col>
                      <Col span={14} pull={2}>
                        <span className={styles.text}>{data.lbkhSssjdw || '无'}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <span className={styles.detailFont}>所属二级单位：</span>
                      </Col>
                      <Col span={14} pull={2}>
                        <span className={styles.text}>{data.lbkhSsejdw || '无'}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <span className={styles.detailFont}>机构代码：</span>
                      </Col>
                      <Col span={12} pull={2}>
                        <span className={styles.text}>{data.lbkhJgdm || '无'}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <span className={styles.detailFont}>是否军品客户：</span>
                      </Col>
                      <Col span={14} pull={2}>
                        <span className={styles.text}>{data.lbkhSfJpkh || '无'}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <span className={styles.detailFont}>顺序码：</span>
                      </Col>
                      <Col span={16} pull={3}>
                        <span className={styles.text}>{data.lbkhSxm || '无'}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <span className={styles.detailFont}>其他经营地址：</span>
                      </Col>
                      <Col span={14} pull={2}>
                        <span className={styles.text}>{data.extraJydz || '无'}</span>
                      </Col>
                    </Row>
                  </div> : null
              }
            </WingBlank>
          </Panel>
        </Accordion>
      </div>
    );
  }
}
