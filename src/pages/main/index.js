import React, { PureComponent } from 'react';
import { Grid, Icon, NavBar, Card, WhiteSpace, List, WingBlank, Toast } from 'antd-mobile';
import { Row, Col } from 'antd';
import router from 'umi/router';
import BizIcon from '@/lib/BizIcon';
import styles from './index.less';
import { closeFrame } from '@/utils/cordova';
import modalPhoto from '@/assets/modal.jpg';
import { connect } from 'dva';

const { Header } = Card;
const { Body } = Card;
const { Item: ListItem } = List;
@connect((state) => {
  main: state.main
})
export default class Shop extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      point: {}
    };
  }

  componentDidMount() {
    const{dispatch} = this.props;
    dispatch({
      type: 'main/getPoint'
    }).then((res) => {
      if(res) {
        const {success, data, message} = res;
        if(success && data) {
          this.setState({
            point: data
          })
        }else {
          // data.errMsg &&Toast.fail(data.errMsg,1)
        }
      }
    })
  }

  getData = () => {
    return [
      { icon: <BizIcon type='daibanshixiang' style={{ fontSize: '0.5rem' }}/>, text: <span className={styles.ejfontSize}>拜访客户</span>, path: '/khbf' },
      { icon: <BizIcon type='gaoxiaofei' style={{ fontSize: '0.5rem' }}/>, text: <span className={styles.ejfontSize}>发布商机</span>, path: '/business' },
      { icon: <BizIcon type='zhanghaoquanxianguanli' style={{ fontSize: '0.5rem' }}/>, text: <span className={styles.ejfontSize}>待办任务</span>, path: '/task' },
    ];
  };

  click = data => {
    router.push(data.path);
  };

  render() {
    const {point} = this.state;
    const data = this.getData();
    return (
      <div className={styles.contain}>
        <div>
          <NavBar
            mode="light"
            leftContent={<a style={{ color: '#444' }} onClick={closeFrame}><Icon type='left'/></a>}>
            客户关系
          </NavBar>
          <img src={modalPhoto} width='100%' height={400}/>
          <WhiteSpace size={'lg'}/>
          <Card full>
            <Header title='统计'/>
            <Body className={styles.ejfontSize}>
              <WingBlank size='lg'>
                <Row>
                  <Col span={6} push={1}>{point.customer}</Col>
                  <Col span={6} push={1}>{point.product}</Col>
                  <Col span={6} push={1}>{point.contract}</Col>
                  <Col span={6} push={1}>{point.business}</Col>
                </Row>
                <Row>
                  <Col span={6}>客户数</Col>
                  <Col span={6}>产品数</Col>
                  <Col span={6}>合同数</Col>
                  <Col span={6}>商机数</Col>
                </Row>
              </WingBlank>
            </Body>
          </Card>
          <WhiteSpace size={'lg'}/>
          <Card full>
            <Header title='常用功能'/>
            <Body>
              <Grid data={data} columnNum={3} onClick={this.click} hasLine={false}/>
            </Body>
          </Card>
          <WhiteSpace size={'lg'}/>
          <Card full>
            <Header title='待办任务'/>
            <Body>
              <ListItem extra={<a className={styles.ejfontSize}>去申请完成</a>}><span
                className={styles.ejfontSize}>商机采购空调150台</span></ListItem>
              <ListItem extra={<a className={styles.ejfontSize}>待审批</a>}><span
                className={styles.ejfontSize}>采购笔记本电脑120台</span></ListItem>
            </Body>
          </Card>
          <WhiteSpace size={'lg'}/>
        </div>
      </div>
    );
  }
}

