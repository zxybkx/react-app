import React, { PureComponent } from 'react';
import {
  Checkbox,
  NavBar,
  Popover,
  List,
  Modal,
  SearchBar,
  ListView, Card,
} from 'antd-mobile';
import router from 'umi/router';
import { connect } from 'dva';
import { Divider, Row, Col } from 'antd';
import _ from 'lodash';
import styles from './ProductList.less';
import { isJSXNamespacedName } from '@babel/types';

const { Item: Item } = Popover;
const ListItem = List.Item;
const Brief = ListItem.Brief;
const { CheckboxItem: CheckboxItem } = Checkbox;
@connect((state) => ({
  business: state.business,
  product: state.product,
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
      data: [],
      params: {},
      page: 0,
      size: 100,
      currentPageData: [],         // 当前页面请求返回的数据
      selectedReocrd: [],         // 选择的产品
    };
  }

  componentDidMount() {
    const { size } = this.state;
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

  loadData = (params = {}) => {
    const { dispatch } = this.props;
    const { size } = this.state;

    //去除查询条件中为空的字段
    _.forEach(params, (value, key) => {
      if (value === null || value === '') {
        delete params[key];
      }
    });
    dispatch({
      type: 'product/getProductList',
      payload: params,
    }).then(({ success, data, page }) => {
      if (success && data) {
        const _data = _.cloneDeepWith(data);
        _data.map(item => {
          item.selected = false;
        });
        this.setState({
          data: _data,
          // currentPageData: data,
          params,
        });
        if (data.length < size) {
          this.setState({ isLoading: false });
        }
      }
    });
  };

  onChange = (visible) => {
    this.setState({ visible });
  };

  onSearch = (value) => {
    const { params } = this.state;
    const _params = {
      'cpmc.contains': value,
      'createdName.contains': value,
      'pinyin.contains': value,
      'initial.contains': value,
      advanced: false,
      page: 0,
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

  onSelect = (record) => {
    const { selectedReocrd, data } = this.state;
    let _selectedReocrd = _.cloneDeepWith(selectedReocrd);
    const _data = _.cloneDeepWith(data);

    // 在数据源中做标记
    _data.map(item => {
      if(item.id === record.id) {
        item.selected = !item.selected
      }
    });

    if (_.isEmpty(_selectedReocrd)) {
      _selectedReocrd.push(record);
      this.setState({
        selectedReocrd: _selectedReocrd,
      });
    } else {
      const repeatRecord = _.find(_selectedReocrd, item => item.id === record.id);
      if (repeatRecord) {
        _.remove(_selectedReocrd, i => i.id === repeatRecord.id);
      } else {
        _selectedReocrd.push(record);
      }
    }

    this.setState({
      selectedReocrd: _selectedReocrd,
      data: _data
    });

    this.props.onSelect(_selectedReocrd);
    // this.props.onClose()
  };

  onClose = () => {
    // this.setState({
    //   selectedReocrd: [],
    // });
    this.props.onClose();
  };

  render() {
    const { visible } = this.props;
    const { data, dataSource, isLoading } = this.state;
    // console.log(data);
    const row = (rowData, sectionID, rowID) => {
      const url = rowData.fileList.length > 0 ? `/gateway/fileservice/api/file/view/${rowData.fileList[0].fileId}` : `/gateway/fileservice/api/file/view/5d82f2f0a1d43e01417a3a8f`;
      const title = (
        <div className={styles.title}>
          <div className={styles.titleTop}>
            <span className={styles.name}>{rowData.cpmc}&nbsp;&nbsp;{rowData.gs}</span>
          </div>
          <div className={styles.titleBtm}>
            <p>
              <span className={styles.unit}>￥</span>
              <span className={styles.money}>{rowData.dj ? rowData.dj : '暂无'}</span>
            </p>
            <span className={styles.address}>{rowData.dwmc}</span>
          </div>
        </div>
      );
      return (
        <div key={rowID}>
          {/*<CheckboxItem onChange={() => this.onSelect(rowData)}>*/}
            <Card onClick={() => this.onSelect(rowData)}>
              <Card.Header title={title}
                           thumb={<img src={url} width="200rem" height='200rem' style={{ borderRadius: '0.1rem' }}/>}
                           extra={rowData.selected && <span style={{color: 'red'}}>√</span>}
              />
            </Card>
          {/*</CheckboxItem>*/}
        </div>
      );
    };

    return (
      <Modal visible={visible}>
        <NavBar
          mode='dark'
          rightContent={<a onClick={this.onClose} style={{ color: '#fff' }}>确定</a>}>
          选择产品
        </NavBar>
        <SearchBar
          clear
          cancelText='搜索'
          placeholder='产品名称/创建人'
          showCancelButton
          onClear={this.onClear}
          onCancel={(value) => this.onSearch(value)}/>
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource.cloneWithRows(data)}
          // renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
          //   {isLoading ? '加载中...' : '到底了'}
          // </div>)}
          renderRow={row}
          className="am-list"
          pageSize={4}
          useBodyScroll
          scrollRenderAheadDistance={500}
          // onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </Modal>
    );
  }
}
