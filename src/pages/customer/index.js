import React, { PureComponent, Component } from 'react';
import {
  Icon,
  NavBar,
  ListView,
  Card,
  WhiteSpace,
  WingBlank,
  Modal,
  List,
  Popover,
  SearchBar,
  Button,
} from 'antd-mobile';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import { Divider } from 'antd';
import cus from '@/assets/cus.png';
import BizIcon from '@/lib/BizIcon';
import styles from './index.less';

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;
const { Item: PopoverItem } = Popover;

@connect((state) => ({
  customer: state.customer,
}))

export default class Customer extends PureComponent {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource,
      isLoading: true,
      visible: false,
      page: 0,
      size: 10,
      params: {},
      dataList: [],
      currentPageData: [],         // 当前页面请求返回的数据
    };
  }

  componentDidMount() {
    const {size} = this.state;
    const params = {
      page: 0,
      size: size,
      'actived.equals': 'T',
      'enabled.equals': 'T',
      advanced: true,
      sort: 'createdDate,desc',
      'khzt.in': ['1', '2', '3', '4'],
    };
    this.loadData(params);
  }

  onEndReached = () => {
    const { params, currentPageData, size } = this.state;
    const lg = currentPageData.length;
    //当前页请求的数据数量等于初始请求数据数量，继续请求下一页数据
    if (Number(lg) === Number(size)) {
      const _params = _.cloneDeepWith(params);
      _params.page += 1;
      this.setState({ params: _params });
      this.loadData(_params);
    }
  };

  loadData = (params = {}) => {
    const { dispatch } = this.props;
    const { dataList, size } = this.state;
    dispatch({
      type: 'customer/getDataList',
      payload: params,
    }).then(({ success, data, page }) => {
      if (success && data) {
        const _dataList = _.cloneDeepWith(dataList);
        this.setState({
          dataList: _.concat(_dataList, data),
          currentPageData: data,
          params,
        });
        if(data.length < size) {
          this.setState({ isLoading: false });
        }
      }
    });
  };

  renderRightContent = () => {
    const { visible } = this.state;
    return (
      <Popover visible={visible}
               overlay={[
                 (<PopoverItem key={'1'} value={'bfke'}>拜访客户</PopoverItem>),
                 (<PopoverItem key={'2'} value={'bfjl'}>拜访记录</PopoverItem>),
                 (<PopoverItem key={'3'} value={'xzkh'}>新增客户</PopoverItem>),
               ]}
               align={{
                 overflow: { adjustY: 0, adjustX: 0 },
                 offset: [-10, 0],
               }}
               onVisibleChange={this.handleVisibleChange}
               onSelect={this.onSelect}>
        <Icon type='ellipsis'/>
      </Popover>
    );
  };

  // handleVisibleChange = (visible) => {
  //   this.setState({
  //     visible: visible,
  //   });
  // };

  // onSelect = (opt) => {
  //   this.setState({
  //     visible: false,
  //   });
  //   if (opt.key === '1') {
  //     router.push('/khbf');
  //   } else if (opt.key === '2') {
  //     router.push('/khbf/list');
  //   } else {
  //     console.log('add');
  //   }
  // };

  onClear = () => {
    const { size } = this.state;
    const params = {
      page: 0,
      size: size,
      'actived.equals': 'T',
      'enabled.equals': 'T',
      advanced: true,
      sort: 'createdDate,desc',
      'khzt.in': ['1', '2', '3', '4'],
    };
    this.loadData(params);
  };

  onSearch = (value) => {
    const { params } = this.state;
    const _params = {
      page: 0,
      'khmc.contains': value,
      advanced: false,
    };
    this.setState({
      dataList: [],
    }, () => {
      this.loadData({
        ...params,
        ..._params,
      });
    });
  };

  onDelete = (record) => {
    const { dispatch } = this.props;
    const { params } = this.state;
    dispatch({
      type: 'customer/changeKhzt',
      payload: { id: record.id, khzt: '5' },
    }).then((res) => {
      if (res) {
        const { success } = res;
        if (success) {
          this.loadData({ ...params });
        }
      }
    });
  };

  onEdit = (record) => {
    router.push({
      pathname: '/customer/editForm',
      query: {
        id: record.id,
      },
    });
  };

  addCustomer = () => {
    router.push('/customer/editForm');
  };

  getDetail = (obj) => {
    router.push({
      pathname: '/customer/detailForm',
      query: {
        id: obj.id,
      },
    });
  };

  render() {
    const { dataList, dataSource, isLoading } = this.state;
    const row = (rowData, sectionID, rowID) => {
      const title = (
        <div key={rowID} style={{ fontWeight: 'bold' }}>
          <div style={{ marginBottom: '8px', lineHeight: '2' }}>
            <img src={cus}/>
            {rowData.khmc}
            <div style={{ fontSize: '0.30rem', color: '#A6A6A6' }}>地址：{rowData.extraZcdz || '无'}</div>
          </div>
        </div>
      );
      return (
        <div style={{ backgroundColor: '#eee' }}>
          <div style={{ padding: '10px' }}/>
          <WingBlank>
            <Card>
              <Card.Header
                title={title}/>
              <Divider/>
              <Card.Footer content={<div style={{ float: 'right' }}>
                <a onClick={() => this.onEdit(rowData)} style={{ marginRight: 30 }}>编辑</a>
                <a onClick={() => alert('确定删除该客户吗？', '', [
                  {
                    text: '取消', onPress: () => {
                    },
                  },
                  {
                    text: '确定', onPress: () => {
                      this.onDelete(rowData);
                    },
                  },
                ])}>删除</a>
              </div>}/>
            </Card>
          </WingBlank>
        </div>
      );
    };

    return (
      <div>
        <NavBar mode={'light'}
                icon={<Icon type={'left'}/>}
                onLeftClick={() => router.push('/')}
          // rightContent={this.renderRightContent()}
        >客户</NavBar>
        <SearchBar
          clear
          cancelText='搜索'
          placeholder='客户名称'
          showCancelButton
          onClear={this.onClear}
          onCancel={(value) => this.onSearch(value)}/>
        <WhiteSpace size="lg"/>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Button inline size='small' onClick={() => router.push('/khbf')}>拜访客户</Button>
          <Button inline size='small' onClick={() => router.push('/khbf/list')}
                  style={{ marginLeft: 20, marginRight: 20 }}>拜访记录</Button>
          <Button inline size='small' onClick={this.addCustomer}>新增客户</Button>
        </div>
        <WhiteSpace size="lg"/>
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource.cloneWithRows(dataList)}
          renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
            {isLoading ? '加载中...' : '到底了'}
          </div>)}
          renderRow={row}
          className="am-list"
          pageSize={4}
          useBodyScroll
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </div>
    );
  }
}
