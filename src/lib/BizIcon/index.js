
import React from 'react';

const BizIcon = props => {
  const { type, style = {} } = props;
  return <i className={`iconfont icon-${type}`} style={style} />;
};
export default BizIcon;
