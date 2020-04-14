import React from 'react';
import {WhiteSpace, NoticeBar} from 'antd-mobile';
import moment from 'moment';
import styles from './index.less';

moment.locale('zh-cn');

const now = moment.now();
export default class Timeline extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data = [], currentDate = new Date(), emptyText = '没有数据', showDate = true} = this.props;
    const date = moment(currentDate);
    return (
      <div className={styles.default}>
        { showDate && <div className={styles.date}>{`${date.format('YYYY年MM月DD日 dddd')}`}</div>}
        {
          _.isEmpty(data) && (
            <NoticeBar icon={null}>
              {emptyText}
            </NoticeBar>
          )
        }
        <div className={styles.timeline}>
          {
            !_.isEmpty(data) && (
              <ul>
                {
                  _.map(data, (d, idx) => {
                    const begin = moment(d.begin);
                    const past = begin.isBefore(now);
                    return (
                      <li key={idx} className={past ? styles.past : ''}>
                        <div className={styles.dot}>&nbsp;</div>
                        <div className={styles.time}>{moment(d.begin).format('HH:mm')}</div>
                        <div className={`${styles.content} ${past ? styles.past : ''}`}>
                          <div className={styles.title}>{d.title}</div>
                          <div className={styles.desc}>
                            <ol>
                              <li><span>时间：</span>{moment(d.begin).format('HH:mm')}  -  {moment(d.end).format('HH:mm')}</li>
                              <li><span>地点：</span>{d.address}</li>
                              {
                                d.remark && <li><span>备注：</span>{d.remark}</li>
                              }
                              {
                                !_.isEmpty(d.members) && (
                                  <li>
                                    <span>参与者：</span> {_.map(d.members, u => u.name).join('，')}
                                  </li>
                                )
                              }
                            </ol>
                          </div>
                        </div>
                      </li>
                    );
                  })
                }
              </ul>
            )
          }
        </div>
        <WhiteSpace size="lg" />
      </div>
    );
  }
}
