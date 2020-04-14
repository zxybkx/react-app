import React, { PureComponent } from 'react';
import {
  Icon,
  NavBar,
  Button,
  InputItem,
  TextareaItem,
  List,
  Picker,
  WingBlank,
  WhiteSpace,
  Toast,
} from 'antd-mobile';
import router from 'umi/router';
import { createForm } from 'rc-form';
import { connect } from 'dva';
import PictureUploader from '@/lib/Forms/PictureUploader';
import { message } from 'antd';
import Session from '@/utils/session';
import styles from './index.less';

const { Item: Item } = List;
@createForm()
@connect((state) => ({
  product: state.product,
}))
export default class Khbf extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: [],     //产品类型
      files: [],
      pinyin: {},   //产品名称拼音
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
    router.push('/product');
  };

  getPinYin = (text) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/getPinYin',
      payload: { text },
    }).then(({ success, data }) => {
      if (success && data) {
        this.setState({
          pinyin: data,
        });
      }
    });
  };

  onChange = (files) => {
    this.setState({
      files,
    });
  };

  onSave = () => {
    const { form: { validateFields }, dispatch } = this.props;
    const { files, pinyin } = this.state;

    validateFields((errs, fields) => {
      if (errs) {
        Toast.info('信息填写不完整！');
      } else {
        let photos = [];
        // files && files.map(o => {
        //   const item = {
        //     'fileId': o.id,
        //     'fileName': o.name,
        //   };
        //   photos.push(item);
        // });
        dispatch({
          type: 'product/addProduct',
          payload: {
            ...fields,
            fileList: photos,
            type: fields['type'][0],
            initial: pinyin && pinyin.initial,
            pinyin: pinyin && pinyin.pinyin,
          },
        }).then(({ success, data, message }) => {
          if (success && data) {
            Toast.success('发布成功', 1);
            router.push('/product');
          } else {
            Toast.fail(message, 1);
          }
        });
      }
    });
  };

  render() {
    const { form: { getFieldProps } } = this.props;
    const { type, files } = this.state;
    let _type = [];
    type && type.map(item => {
      const _item = {
        label: item.name,
        value: item.useName,
      };
      _type.push(_item);
    });
    return (
      <div>
        <NavBar mode={'light'} icon={<Icon type={'left'}/>} onLeftClick={this.back}>
          产品发布
        </NavBar>
        <List>
          <InputItem
            {...getFieldProps('cpmc', {
              // initialValue: khfzyyhrObj && khfzyyhrObj.userName,
              rules: [{
                required: true,
                message: '请输入产品名称',
              }],
            })}
            placeholder={'产品名称'}
            onBlur={(value) => this.getPinYin(value)}>
            <span className={styles.must}>*</span>
            产品名称
          </InputItem>
          <Picker {...getFieldProps('type', {
            // initialValue: id,
          })} data={_type} cols={1}>
            <Item arrow={'horizontal'}>产品类型</Item>
          </Picker>
          <TextareaItem
            {...getFieldProps('cpgs', {
              // initialValue: rcgjData && rcgjData.gjmd,
            })}
            title={'产品概述'}
            rows={3}
            placeholder={'请输入140字以内的产品概述'}
            count={140}/>
          {/*<PictureUploader maxSize={5} onChange={(files) => this.onChange(files)}/>*/}
          <InputItem
            {...getFieldProps('dwmc', {
              initialValue: Session.get().orgName,
            })}
            disabled={true}>
            发布单位
          </InputItem>
          <InputItem value={Session.get().name} disabled={true}>
            发布人
          </InputItem>
        </List>
        <WhiteSpace size='lg'/>
        <WingBlank>
          <Button type={'primary'} onClick={this.onSave}>发布</Button>
        </WingBlank>
      </div>
    );
  }
}
