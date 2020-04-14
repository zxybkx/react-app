import React, { PureComponent } from 'react';
import {
  Icon,
  NavBar,
  Button,
  InputItem,
  Modal,
  TextareaItem,
  List,
  Card,
  WingBlank,
  Toast,
  WhiteSpace,
  Popover,
} from 'antd-mobile';
import { Divider } from 'antd';
import router from 'umi/router';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import Session from '@/utils/session';
import CustomerOption from './components/CustomerOption';
import CreateCustomer from './components/CreateCustomer';
import ProductList from './components/ProductList';
import CreateProduct from './components/CreateProduct';
import styles from './index.less';

const { Item: Item } = List;
const { Header: Header } = Card;
const { Body: Body } = Card;
const { Footer: Footer } = Card;
const alert = Modal.alert;

@createForm()
@connect((state) => ({
  business: state.business,
  product: state.product,
}))
export default class Khbf extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      value: '',
      pinyin: {},
      type: [],
      visible: false,
      relatedCustomer: {},
      relatedVisible: false,
      selectedRecord: {},        //选择的客户
      productRecord: [],         //选择的产品
      productRelatedVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
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

  back = () => {
    router.push('/business');
  };

  onChange = (value) => {
    const { form: { setFieldsValue } } = this.props;
    const patt = new RegExp(/^([0-9]{1,10}(\.\d{1,2})?)$/);
    if (patt.test(value)) {
      setFieldsValue({
        ['yjje']: value,
      });
      this.setState({
        hasError: false,
      });
    } else {
      this.setState({
        hasError: true,
      });
    }
    this.setState({ value });
  };

  onErrorClick = () => {
    const { hasError } = this.state;
    if (hasError) {
      Toast.info('请输入正确的金额', 1);
    }
  };

  getPinYin = (text) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'business/getPinYin',
      payload: { text },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          pinyin: data,
        });
      }
    });
  };

  onSave = () => {
    const { form: { validateFields }, dispatch } = this.props;
    const { hasError, value, pinyin, selectedRecord , productRecord} = this.state;
    let productId = [];
    productRecord.map(item => {
      const _item = {
        productId: item.id
      };
      productId.push(_item);
    });
    validateFields((errs, fields) => {
      if (errs || hasError) {
        Toast.info('信息填写有误或不完整！');
      } else {
        dispatch({
          type: 'business/addBusiness',
          payload: {
            ...fields,
            customerId: selectedRecord.id,
            customerName: selectedRecord.khmc,
            productdtoList: productId,
            yjje: value,
            sjsyr: Session.get().name,
            sjcjrdw: Session.get().orgName,
            sjsyrdw: Session.get().orgName,
            initial: pinyin && pinyin.initial,
            pinyin: pinyin && pinyin.pinyin,
          },
        }).then(({ success, data, message }) => {
          if (success && data) {
            Toast.success('发布成功', 1);
            router.push({
              pathname: '/business/detail',
              query: {id: data.id}
            });
          } else {
            Toast.fail(message, 1);
          }
        });
      }

    });
  };

  relatedCustomer = () => {
    this.setState({
      relatedVisible: true,
    });
  };

  onRelatedOk = () => {

    this.onRelatedCancel;
  };

  onRelatedCancel = () => {
    this.setState({
      relatedVisible: false,
    });
  };

  createCustomer = () => {
    // router.push('/customer/editForm');
  };

  chooseCustomer = (record) => {
    console.log(record);
    this.setState({
      selectedRecord: record,
    });
  };

  resetCustomer = () => {
    this.setState({
      selectedRecord: {},
    });
  };

  relatedProduct = () => {
    this.setState({
      productRelatedVisible: true,
    });
  };

  createProduct = () => {
  };

  onRelatedProductClose = () => {
    this.setState({
      productRelatedVisible: false,
    });
  };

  showToast = () => {
    Toast.info('尚未关联客户');
  };

  chooseProduct = (record) => {
    this.setState({
      productRecord: record,
    });
  };

  resetProduct = () => {
    this.setState({
      productRecord: [],
    });
  };

  render() {
    const { form: { getFieldProps } } = this.props;
    const { hasError, value, selectedRecord, relatedVisible, productRecord, productRelatedVisible, type } = this.state;

    return (
      <div style={{ background: '#eee' }}>
        <NavBar mode={'light'} icon={<Icon type={'left'}/>} onLeftClick={this.back}>
          商机发布
        </NavBar>
        <List>
          <InputItem
            {...getFieldProps('sjmc', {
              rules: [{
                required: true,
                message: '请输入商机名称',
              }],
            })}
            placeholder={'商机名称'}
            onBlur={(value) => this.getPinYin(value)}>
            <span className={styles.must}>*</span>
            商机名称
          </InputItem>
          <InputItem
            {...getFieldProps('yjje', {
              rules: [{
                required: true,
                pattern: new RegExp(/^([0-9]{1,10}(\.\d{1,2})?)$/),
                message: '请输入正确的预计金额',
              }],
            })}
            placeholder={'预计金额'}
            onChange={this.onChange}
            error={hasError}
            onErrorClick={this.onErrorClick}
            value={value}>
            <span className={styles.must}>*</span>
            预计金额
          </InputItem>
          <TextareaItem
            {...getFieldProps('remark', {})}
            title={'商机描述'}
            rows={3}
            placeholder={'请输入140字以内的相关描述'}
            count={140}/>
        </List>
        <WhiteSpace size='lg'/>
        <Card>
          <Header
            title='客户信息'
            extra={
              <div>
                <a className={styles.link} onClick={this.relatedCustomer}>关联客户</a>
                {/*<a className={styles.link} onClick={this.createCustomer}>创建客户</a>*/}
                {
                  _.isEmpty(selectedRecord) ?
                    <a className={styles.clear} onClick={this.showToast}>清空</a> :
                    <a onClick={() => alert('确定清空关联客户吗？', '', [
                      {
                        text: '取消', onPress: () => {
                        },
                      },
                      {
                        text: '确定', onPress: () => {
                          this.resetCustomer();
                        },
                      },
                    ])} className={styles.clear}>清空</a>
                }
              </div>
            }/>
          {
            _.isEmpty(selectedRecord) ? null :
              <Body className={styles.font}>
                <div>
                  <span className={styles.label}>客户名称：</span>
                  <span>{selectedRecord.khmc}</span>
                </div>
                <div>
                  <span className={styles.label}>地址：</span>
                  <span>{selectedRecord.extraZcdz || '无'}</span>
                </div>
                <div>
                  <span className={styles.label}>统一社会编码：</span>
                  <span>{selectedRecord.shxydm || '无'}</span>
                </div>
              </Body>
          }
        </Card>
        <WhiteSpace size='lg'/>
        <Card>
          <Header
            title='产品信息'
            extra={
              <div>
                <a className={styles.link} onClick={this.relatedProduct}>关联产品</a>
                {
                  _.isEmpty(productRecord) ?
                    <a className={styles.clear} onClick={this.showToast}>清空</a> :
                    <a onClick={() => alert('确定清空关联产品吗？', '', [
                      {
                        text: '取消', onPress: () => {
                        },
                      },
                      {
                        text: '确定', onPress: () => {
                          this.resetProduct();
                        },
                      },
                    ])} className={styles.clear}>清空</a>
                }
              </div>
            }/>
          {
            _.isEmpty(productRecord) ? null :
              <Body className={styles.font}>
                {
                  _.map(productRecord, item => {
                    // 产品类型
                    const _type = type && _.find(type, i => i.useName === item.type);
                    return (
                      <div key={item.id}>
                        <div>
                          <span className={styles.label}>产品名称：</span>
                          <span>{item.cpmc}</span>
                        </div>
                        <div>
                          <span className={styles.label}>产品类型：</span>
                          <span>{_type && _type.name || '无'}</span>
                        </div>
                        <Divider/>
                      </div>
                    )
                  })
                }
              </Body>
          }
        </Card>
        <WhiteSpace size='lg'/>
        <Button
          type={'primary'}
          onClick={this.onSave}
          style={{ marginTop: 10 }}>发布</Button>
        <WhiteSpace size='lg'/>
        <CustomerOption
          onSelect={this.chooseCustomer}
          visible={relatedVisible}
          onClose={this.onRelatedCancel}/>
        <ProductList
          onSelect={this.chooseProduct}
          visible={productRelatedVisible}
          onClose={this.onRelatedProductClose}/>
      </div>
    );
  }
}
