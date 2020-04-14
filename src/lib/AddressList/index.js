import React, { Fragment } from 'react';
import { SearchBar, Checkbox, List, Accordion, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from './index.less';

const CheckboxItem = Checkbox.CheckboxItem;

@createForm()
export default class New extends React.PureComponent {

  state = {
    picked: [],
    showSearch: false,
    searchValue: ''
  };

  onExpand = (key) => {
    key && this.props.onExpand(key);
  };

  onPickPeople = (e,object) => {
    const {picked} = this.state;
    const newData = _.cloneDeepWith(picked);
    if(e.target.checked) {
      newData.push(object);
      this.setState({
        picked: newData
      },()=>{
        this.props.onPick(newData);
      })
    }else {
      _.remove(newData,o=>o.id === object.id);
      this.setState({
        picked: newData
      },()=>{
        this.props.onPick(newData);
      })
    }
  };

  onChange = (value) => {
    this.setState({
      searchValue: value
    });
    this.props.onInputChange(value);
  };

  render() {
    const {list,listItem,selected,searchList} = this.props;
    const { getFieldProps } = this.props.form;
    const {showSearch,searchValue} = this.state;

    return (
      <div>
        <SearchBar
          placeholder="搜索"
          value={searchValue}
          maxLength={8}
          onChange={this.onChange}
          // onSubmit={value => console.log(value, 'onSubmit')}
          onFocus={value => {this.setState({showSearch: true})}}
          onCancel={value => {this.setState({showSearch: false,searchValue: ''})}}
        />
        {
          showSearch ?
            <List className={styles.list}>
              {searchList && searchList.length > 0 && searchList.map(j => {
                return (
                  <CheckboxItem
                    key={j.id}
                    onChange={(e) => this.onPickPeople(e,j)}
                  >
                    {j.xm}
                  </CheckboxItem>
                )
              })}
            </List> :
            <Accordion accordion onChange={this.onExpand} className={styles.list}>
              {
                list && list.map(i => {
                  const item = listItem[i.id];
                  return (
                    <Accordion.Panel header={i.name} key={i.id}>
                      <List>
                        {item && item.map(j => {
                          const checked = _.findIndex(selected,o=>o.id === j.id);
                          return (
                            <CheckboxItem
                              {...getFieldProps(`${j.id}`)}
                              checked={checked >= 0}
                              key={j.id}
                              onChange={(e) => this.onPickPeople(e,j)}
                            >
                              {j.name}
                            </CheckboxItem>
                          )
                        })}
                      </List>
                    </Accordion.Panel>
                  )
                })
              }
            </Accordion>
        }
        <Flex style={{background: '#fff',height: '1rem',paddingLeft: '0.3rem'}} justify="start" align="center" >
          <p style={{color: '#108ee9'}}>已选择：{selected.length}人</p>
        </Flex>
      </div>
    );
  }
}
