import React, { PureComponent } from 'react';
import {
  Icon,
  NavBar,
  Popover,
  List,
  SearchBar,
  ListView, Card,
} from 'antd-mobile';
import router from 'umi/router';
import { connect } from 'dva';
import { closeFrame } from '@/utils/cordova';
import { Col, Row, Divider } from 'antd';
import _ from 'lodash';
import styles from './index.less';

const { Item: Item } = Popover;
const ListItem = List.Item;
const Brief = ListItem.Brief;
@connect((state) => ({
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
      visible: false,
      data: [],
      type: [],
      currentChoose: '',
      params: {},
      page: 0,
      size: 10,
      currentPageData: [],         // 当前页面请求返回的数据
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { size } = this.state;
    const params = {
      page: 0,
      size: size,
      advanced: true,
      'enabled.equals': 'T',
    };
    this.loadData(params);

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
        const _data = _.cloneDeepWith(this.state.data);
        this.setState({
          data: _.concat(_data, data),
          currentPageData: data,
          params,
        });
        if (data.length < size) {
          this.setState({ isLoading: false });
        }
      }
    });
  };

  // renderRightContent = () => {
  //   const { visible } = this.state;
  //   return (
  //     <Popover visible={visible}
  //              overlay={[
  //                (<Item key={'1'} value={'新增'} >发布</Item>),
  //              ]}
  //              align={{
  //                overflow: { adjustY: 0, adjustX: 0 },
  //                offset: [-10, 0],
  //              }}
  //              onVisibleChange={this.onChange}
  //              onSelect={this.onSelect}>
  //       <Icon type={'ellipsis'}/>
  //     </Popover>
  //   );
  // };

  renderRightContent = () => {
    return (
      <a onClick={this.onSelect}>发布</a>
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

  getDetail = (record) => {
    router.push({
      pathname: '/product/detail',
      query: {
        id: record.id,
      },
    });
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
      currentChoose: '',   // 去除筛选的状态
    }, () => {
      this.loadData({
        ...params,
        ..._params,
      });
    });
  };

  chooseType = (type) => {
    const params = {
      'type.equals': type,
      'enabled.equals': 'T',
      advanced: true,
      page: 0,
      size: this.state.size,
    };
    this.setState({
      currentChoose: type,
      data: [],
    }, () => {
      this.loadData(params);
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

  render() {
    const { data, dataSource, type, isLoading, currentChoose } = this.state;
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
            <span className={styles.address}>{rowData.dwmc}&nbsp;></span>
          </div>
        </div>
      );
      return (
        <div key={rowID}>
          <Card onClick={() => this.getDetail(rowData)}>
            <Card.Header title={title}
                         thumb={<img src={url} width="200rem" height='200rem' style={{ borderRadius: '0.1rem' }}/>}/>
          </Card>
        </div>

      );
    };

    return (
      <div>
        <NavBar mode={'light'}
                icon={<Icon type={'left'}/>}
                onLeftClick={() => router.push('/')}
                rightContent={this.renderRightContent()}>
          产品中心
        </NavBar>
        <SearchBar
          clear
          cancelText='搜索'
          placeholder='产品名称/创建人'
          showCancelButton
          onClear={this.onClear}
          onCancel={(value) => this.onSearch(value)}/>
        <div className={styles.searchDiv}>
          {/*<span className={styles.searchBtn} style={{color: 'red'}}>推荐</span>*/}
          {
            type.map(item => {
              return (
                <span
                  key={item.useName}
                  onClick={() => this.chooseType(item.useName)}
                  style={{ color: currentChoose === item.useName && 'red' }}
                  className={styles.searchBtn}>
                  {item.name}
                </span>
              );
            })
          }
        </div>
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
