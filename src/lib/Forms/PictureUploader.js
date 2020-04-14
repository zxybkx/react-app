import { PureComponent } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import request from '../../utils/request';
import { getBase64 } from '../_utils/imgConvertor';
import Session from '../../utils/session';

export default class PictureUploader extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps || {}),
      };
    }
    return null;
  }

  componentDidMount() {
    const { value = [] } = this.props;
    if (!_.isEmpty(value)) {
      this.setState({
        fileList: _.map(value, file => ({
          uid: file.uid || file.id,
          status: 'done',
          ...file,
        })),
      });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  beforeUpload = (file, fileList) => {
    const { maxSize } = this.props;
    if (maxSize && ((fileList.length + this.state.fileList.length) > maxSize)) {
      message.warning(`请注意，图片上传数已超过最大限制${maxSize}个，请重新选择！`);
      return false;
    }
  };


  handleChange = ({ fileList }) => {
    const { maxSize } = this.props;
    if (maxSize && fileList.length > maxSize) {
      return null;
    } else {
      this.setState({ fileList }, () => {
        const value = _.map(fileList, f => ({ id: f.response ? f.response.data : f.id ? f.id : null, name: f.name }));
        this.triggerChange(value);
      });
    }
  };

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  handleRemove = file => {
    const id = file.response ? file.response.data : file.id;
    if (id) {
      request(`/gateway/fileservice/api/file/${id}`, {
        method: 'DELETE',
      }).then(({ success }) => {
        if (success) {
          this.props.onRemove && this.props.onRemove(file);
        }
      });
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { multiple = true, single = false, maxSize = -1 } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const session = Object.assign({}, Session.get());
    const token = session.access_token || session.token;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return (
      <div className="clearfix">
        <Upload
          action="/gateway/fileservice/api/file"
          accept='.jpeg,.jpg,.png,.gif'
          listType="picture-card"
          withCredentials
          multiple={multiple && !single}
          fileList={fileList}
          headers={headers}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}>
          {single ? (fileList.length === 1 ? null : uploadButton) : (maxSize >= 0 ? (fileList.length >= maxSize ? null : uploadButton) : uploadButton)}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}
