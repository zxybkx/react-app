import React, { PureComponent } from 'react';
import { List, NavBar, Button, InputItem, Modal, TextareaItem, SearchBar, WhiteSpace } from 'antd-mobile';
import router from 'umi/router';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import Session from '@/utils/session';

const ListItem = List.Item;
@connect((state) => ({
  business: state.business,
  customer: state.customer,
}))
export default class CustomerOption extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      khxx: [],
      selectedRecord: {},
    };
  }

  componentDidMount() {
    this.getCustomer();
  }

  getCustomer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'business/getCustomersList',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          khxx: data,
        });
      }
    });
  };

  onChange = (val) => {
    const params = {
      page: 0,
      size: 5,
      'khmc.contains': val,
      'actived.equals': 'T',
      'enabled.equals': 'T',
      advanced: false,
    };
    this.loadData(params);
  };

  loadData = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/getDataList',
      payload: params,
    }).then(({ success, data, page }) => {
      if (success && data) {
        this.setState({
          khxx: data,
        })
      }
    });
  };

  onClear = () => {
    this.getCustomer();
  };

  onSearch = () => {
  };

  chooseCustomer = (record) => {
    this.props.onSelect(record);
    this.props.onClose()
  };

  clearCustomer = () => {

  };

  render() {
    const { visible } = this.props;
    const { khxx } = this.state;

    return (
      <Modal visible={visible}>
        <NavBar
          mode='dark'
          rightContent={<a onClick={this.props.onClose} style={{ color: '#fff' }}>关闭</a>}>
          选择客户
        </NavBar>
        <SearchBar
          clear
          placeholder='客户名称'
          onChange={this.onChange}
          onClear={this.onClear}
          onCancel={this.onClear}/>
        <List>
          {
            khxx && khxx.map(item => {
              return (
                <div key={item.id}>
                  <WhiteSpace size='lg'/>
                  <ListItem onClick={() => this.chooseCustomer(item)}>
                    {item.khmc}
                  </ListItem>
                </div>
              );
            })
          }
        </List>
      </Modal>
    );
  }
}
