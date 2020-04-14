import React, { PureComponent } from 'react';
import {
  Icon,
  NavBar,
  Button,
  WhiteSpace,
  DatePicker,
  InputItem,
  WingBlank,
  TextareaItem,
  List,
  Popover,
  Picker,
  Toast,
} from 'antd-mobile';
import { Col, Row } from 'antd';
import { createForm } from 'rc-form';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import { closeFrame } from '@/utils/cordova';
import { UserSelector } from '@/lib/Forms/UserSelector';
import CustomerModal from './components/CustomerModal';
import styles from './index.less';

const { Item: Item } = List;

@createForm()
@connect((state) => ({
  khbf: state.khbf,
  customer: state.customer,
}))

export default class Shop extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      khxx: [],
      visible: false,
    };
  }

  componentDidMount() {
    this.getCustomer();
  }

  getCustomer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'khbf/getCustomersList',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          khxx: data,
        });
      }
    });
  };

  renderRightContent = () => {
    const { visible } = this.state;
    return (
      <Popover visible={visible}
               overlay={[
                 (<Item key={'1'} value={'rcgj'} icon={<Icon type={'plus'} size={'xxs'}/>}>新增日常跟进</Item>),
                 (<Item key={'2'} value={'sddc'} icon={<Icon type={'plus'} size={'xxs'}/>}>新增实地调查</Item>),
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

  handleVisibleChange = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  onSelect = (opt) => {
    this.setState({
      visible: false,
    });
    if (opt.key === '1') {
      router.push('khbf/addRcgj');
    } else {
      router.push('khbf/addSddc');
    }
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  addCustomer = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleOk = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/addCustomer',
      payload: values,
    }).then(({ success, data }) => {
      if (success && data) {
        Toast.info('保存成功',1)
        this.handleCnacel();
        this.getCustomer();
      }
    });
  };

  handleCnacel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  onSave = () => {
    const { form: { validateFields }, dispatch } = this.props;
    validateFields((errs, fields) => {
      if (errs) {
        Toast.info('信息填写不完整！');
      } else {
        // 与会人员
        const khfzyyhr = {
          type: 1,
          userName: fields['khfzyyhr'],
          zw: null,
        };
        // 同行人员
        const wfcyryArr = [{ type: 2, userName: fields['wfcyry'], zw: null }];
        const payload = {
          ...fields,
          customerId: fields['customerId'][0],
          type: '1',
          crmKhgjRies: [
            khfzyyhr, ...wfcyryArr,
          ],
        };
        dispatch({
          type: 'khbf/addKhbf',
          payload: payload,
        }).then(({ success, data }) => {
          if (success && data) {
            router.push('khbf/list');
          }
        });
      }
    });
  };

  onCheck = () => {
    router.push('khbf/list');
  };

  render() {
    const { form: { getFieldProps } } = this.props;
    const { khxx, modalVisible } = this.state;
    let customerName = [];
    khxx && khxx.map(item => {
      const _item = {
        label: item.khmc,
        value: item.id,
      };
      customerName.push(_item);
    });

    return (
      <div>
        <NavBar mode={'light'}
                icon={<Icon type={'left'}/>}
                onLeftClick={() => router.push('/')}
          // rightContent={[<Icon key="1" type="ellipsis" />]}
        >客户拜访</NavBar>
        <List>
          <Row>
            <Col span={19}>
              <Picker clear {...getFieldProps('customerId', {
                rules: [{
                  required: true,
                  message: '请选择客户名称',
                }],
              })} data={customerName} cols={1}>
                <Item arrow={'horizontal'}>
                  <span className={styles.must}>*</span>
                  客户名称
                </Item>
              </Picker>
            </Col>
            <Item onClick={this.addCustomer} error={true}><a>新增</a></Item>
          </Row>
          <DatePicker mode={'date'} {...getFieldProps('gjrq', {
            initialValue: new Date(),
            rules: [{
              required: true,
              message: '请选择拜访日期',
            }],
          })}>
            <Item arrow={'horizontal'}>
              <span className={styles.must}>*</span>
              拜访日期
            </Item>
          </DatePicker>
          <InputItem
            clear
            {...getFieldProps('khfzyyhr', {})}
            placeholder={'与会人员'}>
            与会人员
          </InputItem>
          <InputItem
            clear
            {...getFieldProps('wfcyry', {})}
            placeholder={'同行人员'}>
            同行人员
          </InputItem>
          {/*<UserSelector multiple clearable/>*/}
          <TextareaItem
            clear
            {...getFieldProps('gjmd', {})}
            title={'拜访目的'}
            rows={3}
            placeholder={'请输入140字以内的目的'}
            count={140}/>
          <TextareaItem
            clear
            {...getFieldProps('qtqk', {})}
            title={'洽谈情况'}
            rows={3}
            placeholder={'请输入140字以内的说明'}
            count={140}/>
          <TextareaItem
            clear
            {...getFieldProps('remark', {})}
            title={'备注'}
            rows={3}
            placeholder={'请输入140字以内的备注'}
            count={140}/>
        </List>
        <WhiteSpace size="lg"/>
        <WingBlank>
          <Button type={'primary'} onClick={this.onSave}>添加拜访</Button>
          <WhiteSpace size="lg"/>
          <Button onClick={this.onCheck}>拜访记录</Button>
        </WingBlank>
        <CustomerModal
          visible={modalVisible}
          handleOk={this.handleOk}
          handleCnacel={this.handleCnacel}/>
      </div>
    );
  }
}

