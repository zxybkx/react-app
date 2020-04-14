import React, { PureComponent, Component, Fragment } from 'react';
import {
  Icon,
  NavBar,
  WhiteSpace,
  Accordion,
  Modal,
  List,
  Popover,
  InputItem,
  Picker,
  DatePicker,
  Toast,
  TextareaItem,
} from 'antd-mobile';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import styles from './edit.less';
import RegionCascader from '@/lib/Forms/RegionCascader';

const ListItem = List.Item;
const Panel = Accordion.Panel;

@createForm()
@connect((state) => ({
  customer: state.customer,
}))

export default class EditModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      qyType: {},         // 企业类型
      isShow: false,      // 是否展示更多内容
      sfNbkh: '',
      khmchasError: false,
      qyjchasError: false,
      gswzhasError: false,
      shbmhasError:false,
      zcmhasError:false,
      nsdjhhasError:false,
      ygrshasError:false,
      zjlhasError: false,
      mjhasError:false,
      emailhasError:false,
      ywzbrhasError: false,
      data: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //企业类型选项
    dispatch({
      type: 'customer/getOptions',
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          qyType: data,
        });
      }
    });
  }

  onSave = () => {
    const { form: { validateFields }, dispatch, record } = this.props;
    const { khmchasError, qyjchasError, gswzhasError, shbmhasError, zcmhasError, nsdjhhasError, ygrshasError, zjlhasError, mjhasError, emailhasError, ywzbrhasError } = this.state;
    const validateErr = [khmchasError, qyjchasError, gswzhasError, shbmhasError, zcmhasError, nsdjhhasError, ygrshasError, zjlhasError, mjhasError, emailhasError, ywzbrhasError];

    validateFields((errs, fields) => {
      if (errs) {
        Toast.info('有必填项未填', 1);
        return;
      }
      if (_.find(validateErr, o => o)) {
        Toast.info('信息填写有误', 1);
      } else {
        _.map(fields, (value, key) => {
          if (key !== 'zcdzgj' && _.isArray(value)) {
            _.set(fields, key, fields[key][0]);
          }
        });

        if (record.id) {
          // 修改
          _.set(fields, 'id', record.id);
          dispatch({
            type: 'customer/saveEditCustomer',
            payload: {
              ...fields,
            },
          }).then(({ success, data, message }) => {
            if (success && data) {
              Toast.info('保存成功', 1);
              this.props.onClose()
            } else {
              Toast.info(message, 1);
            }
          });
        } else {
          // 新增
          dispatch({
            type: 'customer/saveAddCustomer',
            payload: {
              ...fields,
            },
          }).then(({ success, data, massage }) => {
            if (success && data) {
              Toast.info('保存成功', 1);
              this.props.onClose()
            } else {
              Toast.info(message, 1);
            }
          });
        }
      }
    });
  };

  isShow = (value) => {
    if (value[0] === '是') {
      this.setState({
        isShow: true,
        sfNbkh: value,
      });
    } else {
      this.setState({
        isShow: false,
        sfNbkh: value,
      });
    }
  };

  // 客户名称校验
  validateKhmc = (rule, value, callback) => {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'customer/validateKhmc',
      payload: {
        id: record.id,
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

  // 企业简称校验
  validateKhjc = (rule, value, callback) => {
    const patt = new RegExp(/^\D*$/);
    if (patt.test(value)) {
      callback(
        this.setState({
          qyjchasError: false,
        }),
      );
    } else {
      callback(
        this.setState({
          qyjchasError: true,
        }),
      );
    }
  };

  onQyjcErrorClick = () => {
    const { qyjchasError } = this.state;
    if (qyjchasError) {
      Toast.info('请输入不包含数字的客户简称', 1);
    }
  };

  // 网址校验
  validateExtraGsWz = (rule, value, callback) => {
    const patt = new RegExp(/^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9]+)\.)+([A-Za-z0-9])+$/);

    if (value && value !== '') {
      if (patt.test(value)) {
        callback(
          this.setState({
            gswzhasError: false,
          }),
        );
      } else {
        callback(
          this.setState({
            gswzhasError: true,
          }),
        );
      }
    } else {
      callback();
    }
  };

  onGswzErrorClick = () => {
    const { gswzhasError } = this.state;
    if (gswzhasError) {
      Toast.info('示例：http://www.baidu.com', 1);
    }
  };

  // 社会编码校验
  validateShxydm = (rule, value, callback) => {
    const patt = new RegExp(/^([A-Z0-9])*$/);
    if (value && value !== '') {
      if (patt.test(value)) {
        callback(
          this.setState({
            shbmhasError: false,
          }),
        );
      } else {
        callback(
          this.setState({
            shbmhasError: true,
          }),
        );
      }
    }
    callback();
  };

  onShbmErrorClick = () => {
    const { shbmhasError } = this.state;
    if (shbmhasError) {
      Toast.info('请输入正确的统一社会编码', 1);
    }
  };

  // 营业执照注册码校验
  validateYyzzZch = (rule, value, callback) => {
    const patt = new RegExp(/^[1-9][0-9]*$/);
    if (value && value !== '') {
      if (patt.test(value)) {
        callback(
          this.setState({
            zcmhasError: false,
          }),
        );
      } else {
        callback(
          this.setState({
            zcmhasError: true,
          }),
        );
      }
    } else {
      callback();
    }
  };

  onZcmErrorClick = () => {
    const { zcmhasError } = this.state;
    if (zcmhasError) {
      Toast.info('请输入正确的营业执照注册码', 1);
    }
  };

  // 纳税登记号校验
  validateNsdjh = (rule, value, callback) => {
    const patt = new RegExp(/^[A-Z0-9]*$/);
    if (value && value !== '') {
      if (patt.test(value)) {
        callback(
          this.setState({
            nsdjhhasError: false,
          }),
        );
      } else {
        callback(
          this.setState({
            nsdjhhasError: true,
          }),
        );
      }
    } else {
      callback();
    }
  };

  onNsdjhErrorClick = () => {
    const { nsdjhhasError } = this.state;
    if (nsdjhhasError) {
      Toast.info('请输入正确的纳税登记号', 1);
    }
  };

  // 员工人数校验
  validateExtraYgrs = (rule, value, callback) => {
    const patt = new RegExp(/^[1-9][0-9]*$/);
    if (value && value !== '') {
      if (patt.test(value)) {
        callback(
          this.setState({
            ygrshasError: false,
          }),
        );
      } else {
        callback(
          this.setState({
            ygrshasError: true,
          }),
        );
      }
    } else {
      callback();
    }
  };

  onYgrsErrorClick = () => {
    const { ygrshasError } = this.state;
    if (ygrshasError) {
      Toast.info('请输入正确的人数', 1);
    }
  };

  // 总经理校验
  validateExtraZjl = (rule, value, callback) => {
    const patt = new RegExp(/^\D*$/);
    if (patt.test(value)) {
      callback(
        this.setState({
          zjlhasError: false,
        }),
      );
    } else {
      callback(
        this.setState({
          zjlhasError: true,
        }),
      );
    }
  };

  onZjlErrorClick = () => {
    const { zjlhasError } = this.state;
    if (zjlhasError) {
      Toast.info('请输入不包含数字的名称', 1);
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

  onEmailErrorClick = () => {
    const { emailhasError } = this.state;
    if (emailhasError) {
      Toast.info('请输入正确的邮箱', 1);
    }
  };

  // 业务主办人校验
  validateExtraYwzbr = (rule, value, callback) => {
    const patt = new RegExp(/^\D*$/);
    if (patt.test(value)) {
      callback(
        this.setState({
          ywzbrhasError: false,
        }),
      );
    } else {
      callback(
        this.setState({
          ywzbrhasError: true,
        }),
      );
    }
  };

  onYwzbrErrorClick = () => {
    const { ywzbrhasError } = this.state;
    if (ywzbrhasError) {
      Toast.info('请输入不包含数字的名称', 1);
    }
  };

  // 占地面积校验
  validateExtraZdmj = (rule, value, callback) => {
    const patt = new RegExp(/^([1-9]\d*)(\.[0-9]\d*)?$/);
    if (value && value !== '') {
      if (patt.test(value)) {
        callback(
          this.setState({
            mjhasError: false,
          }),
        );
      } else {
        callback(
          this.setState({
            mjhasError: true,
          }),
        );
      }
    } else {
      callback();
    }
  };

  onMjErrorClick = () => {
    const { mjhasError } = this.state;
    if (mjhasError) {
      Toast.info('请输入正确的面积', 1);
    }
  };

  render() {
    const { visible, record, form: { getFieldProps } } = this.props;
    const { qyType, isShow, mjhasError, ywzbrhasError, emailhasError, zjlhasError, ygrshasError, nsdjhhasError, zcmhasError, shbmhasError, gswzhasError, khmchasError, qyjchasError } = this.state;

    // 通讯地址
    const txdz = _.split(record && record.sf, '/');
    // 注册地址
    const zcdz = _.split(record && record.zcdzsf, '/');
    // 企业性质
    const qyxz = [
      { label: '民企', value: '民企' },
      { label: '国企', value: '国企' },
      { label: '政府部门', value: '政府部门' },
      { label: '事业单位', value: '事业单位' },
      { label: '其他', value: '其他' },
    ];

    // 企业类型
    let _qyType = [];
    _.map(qyType, (v, k) => {
      if (k === 'mdDictionaryItems') {
        return (
          v.map((item) => {
            if (item.code === 'enterprise_type') {
              const _item = {
                label: item.itemName,
                value: item.itemValue,
              };
              _qyType.push(_item);
            }
          })
        );
      }
    });

    // 厂房情况
    const cfqk = [
      { label: '租用', value: '租用', test: 11 },
      { label: '自有', value: '自有', test: 22 },
    ];

    // 组合选
    const zlkh = [
      { label: '是', value: '是' },
      { label: '否', value: '否' },
    ];

    return (
      <Modal
        visible={visible}>
        {
          visible ?
            <Fragment>
              <NavBar
                mode='dark'
                leftContent={<a onClick={this.props.onClose} style={{ color: '#fff' }}>关闭</a>}
                rightContent={<a onClick={this.onSave} style={{ color: '#fff' }}>完成</a>}>
                {record.id ? '编辑客户' : '新增客户'}
              </NavBar>
              <InputItem
                {...getFieldProps('khmc', {
                  initialValue: record && record.khmc,
                  rules: [{
                    required: true,
                  }, {
                    validator: this.validateKhmc,
                  }],
                })}
                clear
                error={khmchasError}
                onErrorClick={this.onKhmcErrorClick}
                placeholder="客户名称">
                <span className={styles.must}>*</span>
                客户名称
              </InputItem>
              {/*<Picker*/}
              {/*  data={}*/}
              {/*  {...getFieldProps('gj', {*/}
              {/*    initialValue: txdz,*/}
              {/*  })}>*/}
              {/*  <ListItem>地址</ListItem>*/}
              {/*</Picker>*/}
              <RegionCascader labelInValue/>
              <TextareaItem
                {...getFieldProps('txdz', {
                  initialValue: record && record.txdz,
                })}
                clear
                title={'详细地址'}
                rows={3}
                count={140}
                placeholder={'详细地址'}/>
              <Accordion accordion defaultActiveKey="0">
                <Panel header='基本信息'>
                  <List>
                    <InputItem
                      clear
                      {...getFieldProps('khywm', {
                        initialValue: record && record.khywm,
                      })}
                      placeholder={'英文名称'}>
                      英文名称
                    </InputItem>
                    <InputItem
                      clear
                      {...getFieldProps('khjc', {
                        initialValue: record && record.khjc,
                        rules: [{
                          validator: this.validateKhjc,
                        }],
                      })}
                      // onChange={this.onQyjcChange}
                      error={qyjchasError}
                      onErrorClick={this.onQyjcErrorClick}
                      placeholder="企业简称"
                      // value={qyjcValue}
                    >
                      企业简称
                    </InputItem>
                    <Picker {...getFieldProps('extraQyxz', {
                      initialValue: record && record.extraQyxz && [record.extraQyxz],
                    })} data={qyxz} cols={1}>
                      <ListItem arrow={'horizontal'}>
                        企业性质
                      </ListItem>
                    </Picker>
                    <InputItem
                      clear
                      {...getFieldProps('extraGsWz', {
                        initialValue: record && record.extraGsWz,
                        rules: [{
                          validator: this.validateExtraGsWz,
                        }],
                      })}
                      // onChange={this.onGswzChange}
                      error={gswzhasError}
                      onErrorClick={this.onGswzErrorClick}
                      placeholder="公司网址"
                      // value={gswzValue}
                    >
                      公司网址
                    </InputItem>
                  </List>
                </Panel>
                {/*<Panel header='股东信息'>*/}
                {/*</Panel>*/}
                <Panel header='工商信息'>
                  <InputItem
                    clear
                    {...getFieldProps('fddbr', {
                      initialValue: record && record.fddbr,
                    })}
                    placeholder={'法人代表'}>
                    法人代表
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('extraZczb', {
                      initialValue: record && record.extraZczb,
                    })}
                    placeholder={'注册资本'}>
                    注册资本
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('shxydm', {
                      initialValue: record && record.shxydm,
                      rules: [{
                        validator: this.validateShxydm,
                      }],
                    })}
                    labelNumber={6}
                    error={shbmhasError}
                    onErrorClick={this.onShbmErrorClick}
                    placeholder="统一社会编码"
                  >
                    统一社会编码
                  </InputItem>
                  <DatePicker mode={'date'} {...getFieldProps('extraGsClsj', {
                    initialValue: record && record.extraGsClsj && new Date(record.extraGsClsj),
                  })}>
                    <InputItem arrow={'horizontal'}>
                      成立日期
                    </InputItem>
                  </DatePicker>
                  <InputItem
                    clear
                    {...getFieldProps('yyzzZch', {
                      initialValue: record && record.yyzzZch,
                      rules: [{
                        validator: this.validateYyzzZch,
                      }],
                    })}
                    labelNumber={7}
                    // onChange={this.onZcmChange}
                    error={zcmhasError}
                    onErrorClick={this.onZcmErrorClick}
                    placeholder="营业执照注册码"
                    // value={zcmValue}
                  >
                    营业执照注册码
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('nsdjh', {
                      initialValue: record && record.nsdjh,
                      rules: [{
                        validator: this.validateNsdjh,
                      }],
                    })}
                    // onChange={this.onNsdjhChange}
                    error={nsdjhhasError}
                    onErrorClick={this.onNsdjhErrorClick}
                    placeholder="纳税登记号"
                    // value={nsdjhValue}
                  >
                    纳税登记号
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('zzjgdm', {
                      initialValue: record && record.zzjgdm,
                    })}
                    labelNumber={6}
                    placeholder={'组织机构代码'}>
                    组织机构代码
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('hylb', {
                      initialValue: record && record.hylb,
                    })}
                    placeholder={'行业'}>
                    行业
                  </InputItem>
                  <DatePicker mode={'date'} {...getFieldProps('extraYyzzNsrq', {
                    initialValue: record && record.extraYyzzNsrq && new Date(record.extraYyzzNsrq),
                  })}>
                    <InputItem arrow={'horizontal'} labelNumber={8}>
                      营业执照年审日期
                    </InputItem>
                  </DatePicker>
                  <Picker {...getFieldProps('extraQylx', {
                    initialValue: record && record.extraQylx && [record.extraQylx],
                  })} data={_qyType} cols={1}>
                    <ListItem arrow={'horizontal'}>
                      企业类型
                    </ListItem>
                  </Picker>
                  <DatePicker mode={'date'} {...getFieldProps('extraYbnsrClsj', {
                    initialValue: record && record.extraYbnsrClsj && new Date(record.extraYbnsrClsj),
                  })}>
                    <InputItem arrow={'horizontal'} labelNumber={9}>
                      一般纳税人成立日期
                    </InputItem>
                  </DatePicker>
                  <InputItem
                    clear
                    {...getFieldProps('extraYgrs', {
                      initialValue: record && record.extraYgrs,
                      rules: [{
                        validator: this.validateExtraYgrs,
                      }],
                    })}
                    // onChange={this.onYgrsChange}
                    error={ygrshasError}
                    onErrorClick={this.onYgrsErrorClick}
                    placeholder="员工人数"
                    // value={ygrsValue}
                  >
                    员工人数
                  </InputItem>
                  <TextareaItem
                    clear
                    {...getFieldProps('extraJyfw', {
                      initialValue: record && record.extraJyfw,
                    })}
                    title='经营范围'
                    rows={3}
                    count={140}
                    placeholder={'经营范围'}/>
                  {/*<Picker*/}
                  {/*  data={_districtData}*/}
                  {/*  {...getFieldProps('zcdzgj', {*/}
                  {/*    initialValue: zcdz,*/}
                  {/*  })}>*/}
                  {/*  <ListItem>地址</ListItem>*/}
                  {/*</Picker>*/}
                  <TextareaItem
                    clear
                    {...getFieldProps('extraZcdz', {
                      initialValue: record && record.extraZcdz,
                    })}
                    title={'详细地址'}
                    count={140}
                    rows={3}
                    placeholder={'详细地址'}/>
                </Panel>
                <Panel header='其他'>
                  <InputItem
                    clear
                    {...getFieldProps('extraZjl', {
                      initialValue: record && record.extraZjl,
                      rules: [{
                        validator: this.validateExtraZjl,
                      }],
                    })}
                    // onChange={this.onZjlChange}
                    error={zjlhasError}
                    onErrorClick={this.onZjlErrorClick}
                    placeholder="总经理"
                    // value={zjlValue}
                  >
                    总经理
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('lxdh', {
                      initialValue: record && record.lxdh,
                    })}
                    placeholder={'联系电话'}>
                    联系电话
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('zhmc', {
                      initialValue: record && record.zhmc,
                    })}
                    placeholder={'账户名称'}>
                    账户名称
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('zhhm', {
                      initialValue: record && record.zhhm,
                    })}
                    placeholder={'账户号码'}>
                    账户号码
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('khyhmc', {
                      initialValue: record && record.khyhmc,
                    })}
                    placeholder={'开户银行'}>
                    开户银行
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('cz', {
                      initialValue: record && record.cz,
                    })}
                    placeholder={'传真'}>
                    传真
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('yb', {
                      initialValue: record && record.yb,
                    })}
                    placeholder={'邮编'}>
                    邮编
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('email', {
                      initialValue: record && record.email,
                      rules: [{
                        validator: this.validateEmail,
                      }],
                    })}
                    // onChange={this.onEmailChange}
                    error={emailhasError}
                    onErrorClick={this.onEmailErrorClick}
                    placeholder="邮箱"
                    // value={emailValue}
                  >
                    邮箱
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('extraYwzbr', {
                      initialValue: record && record.extraYwzbr,
                      rules: [{
                        validator: this.validateExtraYwzbr,
                      }],
                    })}
                    // onChange={this.onYwzbrChange}
                    error={ywzbrhasError}
                    onErrorClick={this.onYwzbrErrorClick}
                    placeholder="业务主办人"
                    // value={ywzbrValue}
                  >
                    业务主办人
                  </InputItem>
                  <Picker {...getFieldProps('extraCfqk', {
                    initialValue: record && record.extraCfqk && [record.extraCfqk],
                  })} data={cfqk} cols={1}>
                    <ListItem arrow={'horizontal'}>
                      厂房情况
                    </ListItem>
                  </Picker>
                  <Picker {...getFieldProps('sfJtzlkh', {
                    initialValue: record && record.sfJtzlkh && [record.sfJtzlkh],
                  })} data={zlkh} cols={1}>
                    <ListItem arrow={'horizontal'}>
                      集团战略客户
                    </ListItem>
                  </Picker>
                  <InputItem
                    clear
                    {...getFieldProps('khls', {
                      initialValue: record && record.khls,
                    })}
                    placeholder={'客户隶属'}>
                    客户隶属
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('dwlb', {
                      initialValue: record && record.dwlb,
                    })}
                    placeholder={'单位类别'}>
                    单位类别
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('xylb', {
                      initialValue: record && record.xylb,
                    })}
                    placeholder={'信用类别'}>
                    信用类别
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('dsbm', {
                      initialValue: record && record.dsbm,
                    })}
                    placeholder={'邓氏编码'}>
                    邓氏编码
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('sjmj', {
                      initialValue: record && record.sjmj,
                    })}
                    placeholder={'数据密级'}>
                    数据密级
                  </InputItem>
                  <InputItem
                    clear
                    {...getFieldProps('extraZdmj', {
                      initialValue: record && record.extraZdmj,
                      rules: [{
                        validator: this.validateExtraZdmj,
                      }],
                    })}
                    labelNumber={11}
                    // onChange={this.onMjChange}
                    error={mjhasError}
                    onErrorClick={this.onMjErrorClick}
                    placeholder="办公场所或厂房占地面积"
                    // value={mjValue}
                  >
                    办公场所或厂房占地面积
                  </InputItem>
                  <Picker {...getFieldProps('extraZyzcSfdy', {
                    initialValue: record && record.extraZyzcSfdy && [record.extraZyzcSfdy],
                  })} data={zlkh} cols={1}>
                    <ListItem arrow={'horizontal'}>
                      主资产是否抵押
                    </ListItem>
                  </Picker>
                  <Picker
                    {...getFieldProps('sfNbkh', {
                      initialValue: record && record.sfNbkh,
                    })}
                    // value={sfNbkh}
                    data={zlkh}
                    // onChange={(value) => this.isShow(value)}
                    onOk={(value) => this.isShow(value)}
                    cols={1}>
                    <ListItem arrow={'horizontal'}>
                      内部客户
                    </ListItem>
                  </Picker>
                  {
                    isShow ?
                      <div>
                        <InputItem
                          clear
                          {...getFieldProps('lbkhSssjdw', {
                            initialValue: record && record.lbkhSssjdw,
                          })}
                          labelNumber={6}
                          placeholder={'所属三级单位'}>
                          所属三级单位
                        </InputItem>
                        <InputItem
                          clear
                          {...getFieldProps('lbkhSsejdw', {
                            initialValue: record && record.lbkhSsejdw,
                          })}
                          labelNumber={6}
                          placeholder={'所属二级单位'}>
                          所属二级单位
                        </InputItem>
                        <InputItem
                          clear
                          {...getFieldProps('lbkhJgdm', {
                            initialValue: record && record.lbkhJgdm,
                          })}
                          placeholder={'机构代码'}>
                          机构代码
                        </InputItem>
                        <Picker
                          {...getFieldProps('lbkhSfJpkh', {
                            initialValue: record && [record.lbkhSfJpkh],
                          })}
                          data={zlkh}
                          cols={1}>
                          <ListItem arrow={'horizontal'}>
                            是否军品客户
                          </ListItem>
                        </Picker>
                        <InputItem
                          clear
                          {...getFieldProps('lbkhSxm', {
                            initialValue: record && record.lbkhSxm,
                          })}
                          placeholder={'顺序码'}>
                          顺序码
                        </InputItem>
                        <TextareaItem
                          clear
                          {...getFieldProps('extraJydz', {
                            initialValue: record && record.extraJydz,
                          })}
                          title={'其他经营地址'}
                          rows={3}
                          count={140}
                          labelNumber={6}
                          placeholder={'其他经营地址'}/>
                      </div> : null
                  }
                </Panel>
              </Accordion>
            </Fragment> : null
        }
      </Modal>
    );
  }
}
