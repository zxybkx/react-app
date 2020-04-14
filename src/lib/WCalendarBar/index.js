import React, { PureComponent, Fragment } from 'react';
import { IonSlides, IonSlide, IonList, IonItem, IonGrid, IonRow } from '@ionic/react';
import { Flex, Grid, Icon, Carousel } from 'antd-mobile';
import classnames from 'classnames';
import DateTimeUtils from '../../utils/DateTimeUtils';
import styles from './index.less';
import moment from 'moment';

const today = moment().format('YYYY-MM-DD');
const weekday = ['一','二','三','四','五','六','日'];

export default class CalendarBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      slideDirection: null,
      lastWeek: DateTimeUtils.getLastWeek(1),
      currentWeek: DateTimeUtils.getCurrentWeek(),
      nextWeek: DateTimeUtils.getNextWeek(1),
      selectedDay: moment().format('YYYY-MM-DD'),
      slideIndex: 1
    };
  };

  renderWeekDay = (index) => {
    return weekday[index];
  };

  beforeChange = (from,to) => {
    const type = to - from > 0 ?  'next' : 'pre';
    this.setState({
      slideDirection: type
    })
  };

  SlideTransitionEnd= (current) => {
    this.setState({
      slideIndex: current
    });
    const {slideDirection,lastWeek,currentWeek,nextWeek,selectedDay} = this.state;
    const selectedIndex = _.findIndex(currentWeek,o=>o===selectedDay);
    if(current !== 1) {
      if(slideDirection === 'next') {
        this.setState({
          lastWeek: currentWeek,
          currentWeek: nextWeek,
          nextWeek: DateTimeUtils.getNextWeekArray(nextWeek),
          selectedDay: nextWeek[selectedIndex]
        },()=>{
          this.setState({
            slideIndex: 1
          },()=>{
            this.props.onSlide && this.props.onSlide(nextWeek[selectedIndex])
          });
        });
      }else {
        this.setState({
          lastWeek: DateTimeUtils.getLastWeekArray(lastWeek),
          currentWeek: lastWeek,
          nextWeek: currentWeek,
          selectedDay: lastWeek[selectedIndex]
        },()=>{
          this.setState({
            slideIndex: 1
          },()=>{
            this.props.onSlide && this.props.onSlide(lastWeek[selectedIndex])
          })
        });
      }
    }
  };

  onPickDay = (el, index) => {
    this.setState({
      selectedDay: el,
    },()=>{
      this.props.onPickDay && this.props.onPickDay(el);
    });
  };

  renderBody(data) {
    const {dots} = this.props;
    const {selectedDay} = this.state;

    return(
      <Grid
        className={styles.grid}
        activeStyle={false}
        hasLine={false}
        columnNum={7}
        data={data}
        square={false}
        renderItem={(el, index)=>{
          const dot = _.findIndex(dots,o=>moment(o).format('YYYY-MM-DD') === el);
          return (
            <Flex style={{height: '1.5rem'}} direction="column" justify="around" align="center">
              <p style={{color: '#A5A5A5',fontSize: '0.25rem'}}>{this.renderWeekDay(index)}</p>
              <div className={classnames( el === today ? styles.today : selectedDay === el ? styles.selectedDay : styles.day)}>
                <p className={classnames(el === today ? styles.todayNum : styles.num)}>{ el === today ? '今' : _.split(el,'-')[2].replace(/\b(0+)/gi,"")}</p>
                {
                  dot >= 0 ?
                    <span className={classnames(el === today ? styles.whiteDot : styles.dot)}/> : null
                }
              </div>
            </Flex>
          )
        }}
        onClick={this.onPickDay}
      />
    )
  }

  render() {
    const {extraBottom} = this.props;
    const {lastWeek, currentWeek, nextWeek, selectedDay, slideIndex} = this.state;

    return (
      <Fragment>
        <Carousel
          selectedIndex={slideIndex}
          dots={false}
          beforeChange={this.beforeChange}
          afterChange={this.SlideTransitionEnd}
        >
          {this.renderBody(lastWeek)}
          {this.renderBody(currentWeek)}
          {this.renderBody(nextWeek)}
        </Carousel>
        {
          extraBottom ?
            <Fragment>
              <span className={styles.divider}/>
              <Flex className={styles.week} direction="column" justify="center" align="center">
                {`${moment(selectedDay).format('MM月DD')} 周${this.renderWeekDay(moment(selectedDay).isoWeekday() - 1)}`}
              </Flex>
            </Fragment> : null
        }
      </Fragment>
    );
  }
}
