import React, { PureComponent, Component } from 'react';
import { Icon, NavBar, Popover, Pagination, List, WhiteSpace, WingBlank, Card, Button } from 'antd-mobile';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import cus from '@/assets/cus.png';
import {Divider } from 'antd';

const Item = List.Item;
const Brief = Item.Brief;
@connect((state) => ({
  khbf: state.khbf,
}))
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataList: [],
      total: 0,
      current: 1,
      pageSize: 100,
      params: {}
    };
  }

  componentDidMount() {
    const { location: { query: id } } = this.props;
    const params = {
      'actived.equals': 'T',
      'enabled.equals': 'T',
      page: 0,
      size: 100,
      type: 1,
      advanced: true,
      sort: 'createdDate,desc',
      customerId: id.id,
    };
    this.loadData(params);
  }

  loadData = (params = {}) => {
    const { dispatch, location: { query: id } } = this.props;

    dispatch({
      type: 'khbf/getKhbfList',
      payload: params,
    }).then(({ success, data, page }) => {
      if (success && data) {
        this.setState({
          dataList: data,
          total: page ? page.total : 0,
          current: params && params.page ? parseInt(params.page) + 1 : 1,
          pageSize: params && params.size ? parseInt(params.size) : 100,
          params,
        });
      }
    });
  };

  // renderRightContent = () => {
  //   const { visible } = this.state;
  //   return (
  //     <Popover visible={visible}
  //              overlay={[
  //                (<Popover.Item key={'1'} value={'rcgj'}>新增</Popover.Item>),
  //              ]}
  //              align={{
  //                overflow: { adjustY: 0, adjustX: 0 },
  //                offset: [-10, 0],
  //              }}
  //              onVisibleChange={this.handleVisibleChange}
  //              onSelect={this.onSelect}>
  //       <Icon type='ellipsis'/>
  //     </Popover>
  //   );
  // };

  renderRightContent = () => {
    return (
      <a onClick={this.onSelect}>新增</a>
    )
  };

  handleVisibleChange = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  onSelect = (opt) => {
    this.setState({
      visible: false,
    });
    router.push('/khbf');
  };

  detail = (record) => {
    router.push({
      pathname: '/khbf/detail',
      query: {
        id: record.id,
      },
    });
  };

  onChange = (page, pagesize) => {
    const { params } = this.state;
    this.loadData({
      ...params,
      page: page - 1 > 0 ? page - 1 : 0,
      // size: pagesize,
    });
  };

  render() {
    const { dataList, total, current } = this.state;
    const pageTotal = Math.ceil(total/7);
    return (
      <div>
        <NavBar mode={'light'}
                icon={<Icon type={'left'}/>}
                onLeftClick={() => router.push('/')}
                // rightContent={this.renderRightContent()}
        >拜访记录</NavBar>
        <List>
          {
            dataList && dataList.map((item, i) => {
              const title = (
                <div key={item.id} style={{fontWeight: 'bold'}}>
                  <div style={{ marginBottom: '8px', lineHeight: '2' }}>
                    <img src={cus}/>
                    {item.customerName}
                  </div>
                </div>
              );
              return (
                <div style={{backgroundColor: '#eee'}}>
                  <div style={{padding: '10px'}}/>
                  <WingBlank>
                    <Card>
                      <Card.Header
                        title={title}/>
                      <Divider/>
                      <Card.Footer
                        content={item.lastModifiedDate && moment(item.lastModifiedDate).format('YYYY-MM-DD')}
                        extra={<div>
                          <a onClick={() => this.detail(item)} style={{marginRight:10}}>详情</a>
                        </div>}/>
                    </Card>
                  </WingBlank>
                </div>
                );
            })
          }
        </List>
        <WhiteSpace size="xl"  style={{backgroundColor: '#eee'}}/>
      </div>
    );
  }
}
