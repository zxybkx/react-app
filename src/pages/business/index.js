import React, { PureComponent } from 'react';
import { Icon, List, NavBar, ListView, Popover, SearchBar, WhiteSpace, Card } from 'antd-mobile';
import router from 'umi/router';
import { connect } from 'dva';
import { closeFrame } from '@/utils/cordova';
import styles from '../product/index.less';

const { Item: Item } = Popover;
const ListItem = List.Item;
const Brief = ListItem.Brief;
@connect((state) => ({
  business: state.business,
}))
export default class Product extends PureComponent {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource,
      isLoading: true,
      visible: false,
      data: [],
      params: {},
      page: 0,
      size: 10,
      currentPageData: [],         // 当前页面请求返回的数据
    };
  }

  componentDidMount() {
    const {size} = this.state;
    const params = {
      page: 0,
      size: size,
      advanced: true,
      'enabled.equals': 'T',
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

  loadData = (params) => {
    const { dispatch } = this.props;
    const {size} = this.state;
    //去除查询条件中为空的字段
    _.forEach(params, (value, key) => {
      if (value === null || value === '') {
        delete params[key];
      }
    });

    dispatch({
      type: 'business/getDataList',
      payload: params,
    }).then(({ success, data, page }) => {
      if (success && data) {
        const _data = _.cloneDeepWith(this.state.data);
        this.setState({
          data: _.concat(_data, data),
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
                 (<Item key={'1'} value={'新增'} >新增</Item>),
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

  renderRightContent = () =>{
    return (
      <a onClick={this.onSelect}>发布</a>
    )
  };

  // onChange = (visible) => {
  //   this.setState({ visible });
  // };
  //
  onSelect = (opt) => {
    this.setState({
      visible: false,
    });
    router.push('/business/add');
  };

  onClear = () => {
    const { size } = this.state;
    const params = {
      page: 0,
      size: size,
      advanced: true,
      'enabled.equals': 'T',
    };
    this.loadData(params);
  };

  onSearch = (value) => {
    const { params } = this.state;
    const _params = {
      'sjmc.contains': value,
      'pinyin.contains': value,
      'initial.contains': value,
      'customerName.contains': value,
      page: 0,
      advanced: false,
    };
    this.setState({
      data: [],
    }, () => {
      this.loadData({
        ...params,
        ..._params,
      });
    });
  };

  getDetail = (record) => {
    router.push({
      pathname: '/business/detail',
      query: {id: record.id}
    });
  };

  render() {
    const { data, dataSource, isLoading } = this.state;
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID}>
          <WhiteSpace size='lg'/>
          <ListItem extra={rowData.createdName} onClick={() => this.getDetail(rowData)}>
            {rowData.sjmc}
            <Brief style={{ color: 'red' }}>
              {rowData.yjje ? '￥'+ rowData.yjje : '￥暂无'}
            </Brief>
          </ListItem>
        </div>
      );
    };

    return (
      <div>
        <NavBar mode={'light'}
                icon={<Icon type={'left'}/>}
                onLeftClick={closeFrame}
                rightContent={this.renderRightContent()}
        >
          商机管理
        </NavBar>
        <SearchBar
          clear
          cancelText='搜索'
          placeholder='商机名称/客户名称'
          showCancelButton
          onClear={this.onClear}
          onCancel={(value) => this.onSearch(value)}/>
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource.cloneWithRows(data)}
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
