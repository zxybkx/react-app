import React, { PureComponent } from 'react';
import { TabBar } from 'antd-mobile';
import Router from 'umi/router';
import PropTypes from 'prop-types';
import BizIcon from '../BizIcon';
import theme from '@/theme';

const tabBarData = [
  {
    title: '首页',
    icon: 'shouye',
    selectedIcon: 'shouye',
    link: '/',
  },
  {
    title: '客户',
    icon: 'zhanghaoquanxianguanli',
    selectedIcon: 'zhanghaoquanxianguanli',
    link: '/customer',
  },
  {
    title: '产品',
    icon: 'gongnengdingyi',
    selectedIcon: 'gongnengdingyi',
    link: '/product',
  },
  {
    title: '商机',
    icon: 'gaoxiaofei',
    selectedIcon: 'gaoxiaofei',
    link: '/business',
  },
  {
    title: '我的',
    icon: 'geren',
    selectedIcon: 'geren',
    link: '/me',
  }
];

class MenuBar extends PureComponent {
  render() {
    const { isMenubar, children, pathname } = this.props;
    return (
      <TabBar hidden={isMenubar} tintColor={theme.primaryColor}>
        {tabBarData.map(({ title, icon, selectedIcon, link }) => {
          return(
          <TabBar.Item
            key={link}
            title={title}
            icon={<BizIcon type={icon} style={{fontSize: '1.5em'}} />}
            selectedIcon={<BizIcon type={selectedIcon} style={{fontSize: '1.5em'}} />}
            selected={pathname === link}
            onPress={() => Router.push(`${link}`)}
          >
            {children}
          </TabBar.Item>
        )})}
      </TabBar>
    );
  }
}

MenuBar.defaultProps = {
  isMenubar: false,
  children: null,
  pathname: '/',
};

MenuBar.propTypes = {
  isMenubar: PropTypes.bool,
  children: PropTypes.node,
  pathname: PropTypes.string,
};

export default MenuBar;
