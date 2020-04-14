import React, { Fragment, PureComponent } from 'react';
import { Carousel, Grid, Flex } from 'antd-mobile';
import moment from 'moment';
import DateTimeUtils from '../../utils/DateTimeUtils';
import styles from './index.less';
import classnames from 'classnames';

const weekday = ['一','二','三','四','五','六','日'];
const today = moment().format('YYYY-MM-DD');
let index = 0;

class WeekPicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lastWeek: DateTimeUtils.getLastWeek(1),
      currentWeek: DateTimeUtils.getCurrentWeek(),
      nextWeek: DateTimeUtils.getNextWeek(1),
      pickedDate: moment().format('YYYY-MM-DD'),
      pickedIndex: moment().isoWeekday()
    };
  };

  onPickWeek = (el, index) => {
    this.setState({
      pickedDate: el,
      pickedIndex: moment(el).isoWeekday()
    });
    this.props.onClick(el);
  };

  beforeChange = (from, to) => {
    const {pickedIndex} = this.state;
    index = index + to - from;
    if(index < 0) {
      this.props.onSlide(index,DateTimeUtils.getLastWeek(1),pickedIndex -1);
    }else if (index === 0) {
      this.props.onSlide(index,DateTimeUtils.getCurrentWeek(),pickedIndex - 1);
    }else {
      this.props.onSlide(index,DateTimeUtils.getNextWeek(1),pickedIndex - 1);
    };
  };

  afterChange = () => {
    const {pickedIndex} = this.state;
    if(index < 0) {
      this.setState({
        pickedDate: DateTimeUtils.getLastWeek(1)[pickedIndex -1]
      });
    }else if (index === 0) {
      this.setState({
        pickedDate: DateTimeUtils.getCurrentWeek()[pickedIndex -1]
      });
    }else {
      this.setState({
        pickedDate: DateTimeUtils.getNextWeek(1)[pickedIndex -1]
      });
    };
  };

  renderWeekDay = (index) => {
    return weekday[index];
  };

  componentWillUnmount() {
    index = 0;
  }

  render() {
    const { dataList } = this.props;
    const { pickedDate, currentWeek, nextWeek, lastWeek } = this.state;

    return (
      <Carousel
        dots={false}
        autoplay={false}
        infinite={false}
        selectedIndex={1}
        swipeSpeed={20}
        beforeChange={this.beforeChange}
        afterChange={this.afterChange}
      >
        <Grid
          columnNum={7}
          data={lastWeek}
          square={false}
          renderItem={(el, index)=>{
            const content = _.get(dataList,el);
            return (
              <Flex style={{background: pickedDate === el ? '#8DCC64' : '#fff',height: '1.3rem'}} direction="column" justify="around" align="center">
                <p style={{color: el === today ? '#f76a24' : pickedDate === el ? '#fff' : '#A5A5A5',fontSize: '0.25rem'}}>{el === today ? '今' : this.renderWeekDay(index)}</p>
                <p style={{color: el === today ? '#f76a24' :  pickedDate === el ? '#fff' : '#333333',fontSize: '0.42rem',fontWeight: 'bold'}}>{_.split(el,'-')[2].replace(/\b(0+)/gi,"")}</p>
                {
                  el === today ?
                    <span className={styles.todayDot}/> :
                    <span className={classnames(content && content.length > 0 ? pickedDate === el ? styles.whiteDot : styles.dot : styles.noDot)}/>
                }
              </Flex>
            )
          }}
          onClick={this.onPickWeek}
        />
        <Grid
          columnNum={7}
          data={currentWeek}
          square={false}
          renderItem={(el, index)=>{
            const content = _.get(dataList,el);
            return (
              <Flex style={{background: pickedDate === el ? '#8DCC64' : '#fff',height: '1.3rem'}} direction="column" justify="around" align="center">
                <p style={{color: el === today ? '#f76a24' : pickedDate === el ? '#fff' : '#A5A5A5',fontSize: '0.25rem'}}>{el === today ? '今' : this.renderWeekDay(index)}</p>
                <p style={{color: el === today ? '#f76a24' :  pickedDate === el ? '#fff' : '#333333',fontSize: '0.42rem',fontWeight: 'bold'}}>{_.split(el,'-')[2].replace(/\b(0+)/gi,"")}</p>
                {
                  el === today ?
                    <span className={styles.todayDot}/> :
                    <span className={classnames(content && content.length > 0 ? pickedDate === el ? styles.whiteDot : styles.dot : styles.noDot)}/>
                }
              </Flex>
            )
          }}
          onClick={this.onPickWeek}
        />
        <Grid
          columnNum={7}
          data={nextWeek}
          square={false}
          renderItem={(el, index)=>{
            const content = _.get(dataList,el);
            return (
              <Flex style={{background: pickedDate === el ? '#8DCC64' : '#fff',height: '1.3rem'}} direction="column" justify="around" align="center">
                <p style={{color: el === today ? '#f76a24' : pickedDate === el ? '#fff' : '#A5A5A5',fontSize: '0.25rem'}}>{el === today ? '今' : this.renderWeekDay(index)}</p>
                <p style={{color: el === today ? '#f76a24' :  pickedDate === el ? '#fff' : '#333333',fontSize: '0.42rem',fontWeight: 'bold'}}>{_.split(el,'-')[2].replace(/\b(0+)/gi,"")}</p>
                {
                  el === today ?
                    <span className={styles.todayDot}/> :
                    <span className={classnames(content && content.length > 0 ? pickedDate === el ? styles.whiteDot : styles.dot : styles.noDot)}/>
                }
              </Flex>
            )
          }}
          onClick={this.onPickWeek}
        />
      </Carousel>
    );
  }
}

export default WeekPicker;
