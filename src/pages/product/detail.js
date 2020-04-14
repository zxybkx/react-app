import React, { PureComponent } from 'react';
import { Icon, NavBar, Popover, List, WingBlank, Carousel, WhiteSpace } from 'antd-mobile';
import router from 'umi/router';
import { connect } from 'dva';
import { Row, Col, Divider } from 'antd';
import styles from './index.less';
import moment from '../khbf/detail';
import org from '@/assets/organation.png';
import people from '@/assets/people.png';
import _ from 'lodash';

const { Item: Item } = Popover;
@connect((state) => ({
  product: state.product,
}))
export default class ProductDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: {},
      type: [],
    };
  }

  componentDidMount() {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'product/getDetail',
      payload: { id },
    }).then(({ success, data, message }) => {
      if (success && data) {
        this.setState({ data });
      } else {
        message.error(message);
      }
    });

    //获取配置数据
    dispatch({
      type: 'product/categories',
      payload: {
        name: 'cp-lx',
      },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          type: data,
        });
      }
    });
  }

  renderRightContent = () => {
    const { visible } = this.state;
    return (
      <Popover visible={visible}
               overlay={[
                 (<Item key={'1'} value={'新增'} icon={<Icon type={'plus'} size={'xxs'}/>}>发布</Item>),
               ]}
               align={{
                 overflow: { adjustY: 0, adjustX: 0 },
                 offset: [-10, 0],
               }}
               onVisibleChange={this.onChange}
               onSelect={this.onSelect}>
        <Icon type={'ellipsis'}/>
      </Popover>
    );
  };

  onChange = (visible) => {
    this.setState({ visible });
  };

  onSelect = (opt) => {
    this.setState({
      visible: false,
    });
    router.push('/product/add');
  };

  render() {
    const { data, type } = this.state;
    const _type = type && _.find(type, item => item.useName === data.type);
    return (
      <div>
        <NavBar mode={'light'}
                icon={<Icon type={'left'}/>}
                onLeftClick={() => router.push('/product')}
          // rightContent={this.renderRightContent()}
        >
          产品详情
        </NavBar>
        {
          !_.isEmpty(data.fileList) ?
            <div>
              <WingBlank>
                {
                  data.fileList.length === 1 ?
                    <img
                      src={`/gateway/fileservice/api/file/view/${data.fileList[0].fileId}`}
                      style={{ display: 'inline-block', width: '100%', height: 400 }}/> :
                    <Carousel autoplay={true} infinite={true}>
                      {
                        data.fileList && data.fileList.map(item => {
                          const url = `/gateway/fileservice/api/file/view/${item.fileId}`;
                          return (
                            <img
                              src={url}
                              key={item.id}
                              style={{ display: 'inline-block', width: '100%', height: 400 }}/>
                          );
                        })
                      }
                    </Carousel>
                }
              </WingBlank>
            </div> :
            <WingBlank>
              <img
                src={`/gateway/fileservice/api/file/view/5d82f2f0a1d43e01417a3a8f`}
                style={{ display: 'inline-block', width: '100%', height: 400 }}/>
            </WingBlank>
        }
        <WhiteSpace size='xl'/>
        <WingBlank>
          <div style={{ textAlign: 'center' }}>
            <p className={styles.titlel}>{data.cpmc}</p>
            <WhiteSpace size='sm'/>
            <p className={styles.gs}>{data.cpgs}</p>
            <WhiteSpace size='sm'/>
            <p className={styles.titlel}>{data.dj && '￥' + data.dj}</p>
          </div>
        </WingBlank>
        <Divider/>
        <WingBlank>
          <Row>
            <Col span={15}>
              <img src={org}/>
              <span className={styles.detail}>{data.dwmc}</span>
            </Col>
            <Col span={9}>
              <img src={people}/>
              <span className={styles.detail}>{data.createdName || '无'}</span>
            </Col>
          </Row>
        </WingBlank>
      </div>
    );
  }
}
