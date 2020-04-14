import React, { PureComponent } from 'react';
import { Modal, InputItem, Toast, List, Button, WhiteSpace, WingBlank, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '../index.less';

const Item = List.Item;
@createForm()
@connect((state) => ({
  khbf: state.khbf,
  customer: state.customer,
}))

export default class Shop extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      emailhasError: false,
      khmchasError: false,
      khxzOptions: [],
      khxzvalue: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
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
  }

  onSave = () => {
    const { form: { validateFields, resetFields } , dispatch} = this.props;
    const { khmchasError, khxzvalue, emailhasError } = this.state;
    validateFields((errs, fields) => {
      if (errs || emailhasError || khmchasError) {
        Toast.info('信息填写有误或不完整！', 1);
      } else {
        // 客户性质
        _.set(fields, 'khxz', fields.khxzl[0]);
        _.set(fields, 'khxzmc', khxzvalue);
        delete fields.khxzl;

        dispatch({
          type: 'customer/getKhbm',
          payload: {
            name: fields['khmc'],
            type: fields['khxz'],
          },
        }).then((res) => {
          const { success, data } = res;
          if(success && data) {
            _.set(fields, 'khdm', data);
            this.props.handleOk(fields);
          }
        });
        resetFields();
      }
    });
  };

  onCancel = () => {
    const { form: { resetFields } } = this.props;
    this.props.handleCnacel();
    resetFields();
    this.setState({
      value: '',
      khmcValue: '',
    });
  };

  // 客户名称校验
  validateKhmc = (rule, value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/validateKhmc',
      payload: {
        khmc: value,
      },
    }).then(({ success, data }) => {
      if (success && data) {
        if (data.isRepeated) {
          callback(
            this.setState({
              khmchasError: true,
            }),
          );
        } else {
          callback(
            this.setState({
              khmchasError: false,
            }),
          );
        }
      }
    });
  };

  onKhmcErrorClick = () => {
    const { khmchasError } = this.state;
    if (khmchasError) {
      Toast.info('该用户已存在', 1);
    }
  };

  // 邮箱校验
  validateEmail = (rule, value, callback) => {
    const patt = new RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/);
    if (value && value !== '') {
      if (patt.test(value)) {
        callback(
          this.setState({
            emailhasError: false,
          }),
        );
      } else {
        callback(
          this.setState({
            emailhasError: true,
          }),
        );
      }
    } else {
      callback();
    }
  };

  onErrorClick = () => {
    const { emailhasError } = this.state;
    if (emailhasError) {
      Toast.info('请输入正确的邮箱', 1);
    }
  };

  jumpCustomer = () => {
    router.push('/customer/editForm');
  };

  getkhxz = (label) => {
    this.setState({
      khxzvalue: label[0],
    });
    return label;
  };

  render() {
    const { form: { getFieldProps }, visible } = this.props;
    const { emailhasError, khmchasError, khxzOptions } = this.state;
    // 客户性质
    let khxz = [];
    _.map(khxzOptions, item => {
      const _item = {
        label: item.name,
        value: item.useName,
      };
      khxz.push(_item);
    });
    return (
      <Modal visible={visible}
             title={'新增客户'}
             maskClosable={false}
             transparent
             footer={[
               {
                 text: '取消', onPress: () => {
                   this.onCancel();
                 },
               },
               {
                 text: '保存', onPress: () => {
                   this.onSave();
                 },
               },
             ]}>
        <List>
          <InputItem
            {...getFieldProps('khmc', {
              rules: [{
                required: true,
              }, {
                validator: this.validateKhmc,
              }],
            })}
            error={khmchasError}
            onErrorClick={this.onKhmcErrorClick}
            placeholder="客户名称">
            <span className={styles.must}>*</span>
            客户名称
          </InputItem>
          <Picker
            format={(label) => this.getkhxz(label)}
            {...getFieldProps('khxzl', {
              initialValue: ['0'],
            })}
            disabled
            data={khxz}
            cols={1}>
            <Item arrow={'horizontal'}>
              客户性质
            </Item>
          </Picker>
          <InputItem
            {...getFieldProps('txdz', {})}
            placeholder={'地址'}>
            地址
          </InputItem>
          <InputItem
            labelNumber={6}
            {...getFieldProps('shxydm', {})}
            placeholder={'统一社会代码'}>
            统一社会代码
          </InputItem>
          <InputItem
            {...getFieldProps('email', {
              rules: [{
                validator: this.validateEmail,
              }],
            })}
            type='email'
            placeholder={'邮箱'}
            error={emailhasError}
            onErrorClick={this.onErrorClick}>
            邮箱
          </InputItem>
          <InputItem
            {...getFieldProps('lxdh', {})}
            placeholder={'联系电话'}>
            联系电话
          </InputItem>
        </List>
        <List>
          <Item arrow="horizontal" onClick={this.jumpCustomer}>去完善</Item>
        </List>
      </Modal>
    );
  }
}

