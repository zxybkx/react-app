/**
 * 时间日期工具类
 */
import moment from 'moment';

export default {
  /**
   * 获取本周周一至周日日期
   */
  getCurrentWeek() {
    const weekday = [];
    for(let i=1;i<8;i++) {
      const day = moment().isoWeekday(i).format('YYYY-MM-DD');
      weekday.push(day);
    }
    return weekday;
  },

  /**
   * 获取前 i 周的周一至周日日期，并以数组的方式返回。
   * 当 i=1，获取的是上周一至上周日的日期；
   * 当 i=2，获取的是上上周一至上上周日的日期
   * ...以此类推
   * @param i
   */
  getLastWeek(j) {
    const weekday = [];
    let weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
    for(let i=0;i<7;i++) {
      const day = moment().subtract(weekOfDay + 7 * (j - 1) + i, 'days').format('YYYY-MM-DD');
      weekday.unshift(day);
    }
    return weekday;
  },

  getLastWeekArray(array) {
    const weekday = [];
    array.map((item)=>{
      weekday.push(moment(item).subtract(7, 'days').format('YYYY-MM-DD'));
    });
    return weekday;
  },

  /**
   * 获取后 i 周的周一至周日日期，并以数组的方式返回。
   * 当 i=1，获取的是下周一至下周日的日期；
   * 当 i=2，获取的是下下周一至下下周日的日期
   * ...以此类推
   * @param i
   */
  getNextWeek(j) {
    const weekday = [];
    let weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
    for(let i=0;i<7;i++) {
      const day = moment().add((7 - weekOfDay) + 7 * (j - 1) + 1 + i, 'days').format('YYYY-MM-DD');
      weekday.push(day);
    }
    return weekday;
  },

  getNextWeekArray(array) {
    const weekday = [];
    array.map((item)=>{
      weekday.push(moment(item).add(7, 'days').format('YYYY-MM-DD'));
    });
    return weekday;
  },

  getMonthArray(date) {
    let nowDate = date ? date : new Date();
    let nowMonthFirstDate = moment(nowDate).startOf('month').format('YYYY-MM-DD'); // 获取当月1号日期
    let nowWeek = moment(nowMonthFirstDate).isoWeekday(); // 获取星期
    let newDateList = []; // 创建日期数组
    let startDay =  2 - nowWeek; // 开始日期的下标  以为 setDate(0)是上个月最后一天  所以是2-nowWeek

    let showDayLength = 42;  // 如果5行能显示下一个月 就只显示5行
    // 循环处理 获取日历上应该显示的日期
    for (let i = startDay; i < startDay + showDayLength; i++) {
      let date = new Date(new Date(nowMonthFirstDate).setDate(i)); // 获取时间对象
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() // 小于9的数字前面加0
      let dayObject = {
        date: moment(date).format('YYYY-MM-DD'),
        day: day.toString(),
      };
      newDateList.push(dayObject)
    }

    return newDateList;
  },

  getFirstWeek(month) {
    const date = month ? month : moment();
    const weekday = [];

    for(let i=1;i<8;i++) {
      const day = moment(date).isoWeekday(i).format('YYYY-MM-DD');
      weekday.push(day);
    }

    return weekday;
  },
}
