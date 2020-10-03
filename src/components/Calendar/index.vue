<style scoped>
.calendar,
.times {
  width: 50%;
  min-width: 300px;
  background: #fff;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'STHeiti', 'Microsoft YaHei',
    'WenQuanYi Micro Hei', sans-serif;
  user-select: none;
  position: relative;
  flex: 1;
}
.calendar-tools,
.times-tools {
  height: 40px;
  font-size: 20px;
  color: #5e7a88;
}

.times-tools .day {
  text-align: center;
  color: #5e7a88;
}

.times-tools .lunar {
  font-size: 10px;
  line-height: 1;
  color: #999;
  text-align: center;
}
.times .time-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 44px;
}

.time-list .items {
  width: 20%;
  text-align: center;
  height: 44px;
}
.items span {
  cursor: pointer;
  display: block;
  max-width: 60px;
  height: 26px;
  font-size: 16px;
  line-height: 26px;
  margin: 0px auto;
  border-radius: 20px;
}

.calendar-tools span {
  cursor: pointer;
}
.calendar-prev {
  width: 14.28571429%;
  float: left;
  text-align: center;
}
.calendar-info {
  padding-top: 3px;
  font-size: 16px;
  line-height: 1.3;
  text-align: center;
}
.calendar-info > div.month {
  margin: auto;
  height: 20px;
  width: 100px;
  text-align: center;
  color: #5e7a88;
  overflow: hidden;
  position: relative;
}
.calendar-info > div.month .month-inner {
  position: absolute;
  left: 0;
  top: 0;
  height: 240px;
  transition: top 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.calendar-info > div.month .month-inner > span {
  display: block;
  font-size: 14px;
  height: 20px;
  width: 100px;
  overflow: hidden;
  text-align: center;
}
.calendar-info > div.year {
  font-size: 10px;
  line-height: 1;
  color: #999;
}
.calendar-next {
  width: 14.28571429%;
  float: right;
  text-align: center;
}

.calendar table {
  clear: both;
  width: 100%;
  margin-bottom: 10px;
  border-collapse: collapse;
  color: #444444;
}
.calendar td {
  margin: 2px !important;
  padding: 0px 0;
  width: 14.28571429%;
  height: 44px;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  line-height: 125%;
  cursor: pointer;
  position: relative;
  vertical-align: top;
}
.calendar td.week {
  font-size: 10px;
  pointer-events: none !important;
  cursor: default !important;
}
.calendar td.disabled {
  color: #ccc;
  pointer-events: none !important;
  cursor: default !important;
}
.calendar td.disabled div {
  color: #ccc;
}
.calendar td span {
  display: block;
  max-width: 40px;
  height: 26px;
  font-size: 16px;
  line-height: 26px;
  margin: 0px auto;
  border-radius: 20px;
}
.calendar td:not(.selected) span:not(.red):hover {
  background: #f3f8fa;
  color: #444;
}

.calendar td:not(.selected) span.red:hover {
  background: #f9efef;
}
.calendar td:not(.disabled) span.red {
  color: #ea6151;
}
.calendar td.selected span {
  background-color: #409eff;
  color: #fff;
}
.times .selected {
  background-color: #409eff;
  color: #fff;
}
.calendar td .text {
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  text-align: center;
  padding: 2px;
  font-size: 8px;
  line-height: 1.2;
  color: #444;
}
.calendar td .isGregorianFestival,
.calendar td .isLunarFestival {
  color: #ea6151;
}
.calendar td.selected span.red {
  background-color: #ea6151;
  color: #fff;
}
.calendar td.selected span.red:hover {
  background-color: #ea6151;
  color: #fff;
}
.calendar thead td {
  text-transform: uppercase;
  height: 30px;
  vertical-align: middle;
}
.calendar-button {
  text-align: center;
}
.calendar-button span {
  cursor: pointer;
  display: inline-block;
  min-height: 1em;
  min-width: 5em;
  vertical-align: baseline;
  background: #5e7a88;
  color: #fff;
  margin: 0 0.25em 0 0;
  padding: 0.6em 2em;
  font-size: 1em;
  line-height: 1em;
  text-align: center;
  border-radius: 0.3em;
}
.calendar-button span.cancel {
  background: #efefef;
  color: #666;
}
.calendar-years {
  position: absolute;
  left: 0px;
  top: 60px;
  right: 0px;
  bottom: 0px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow: auto;
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
}
.calendar-years.show {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0px);
}
.calendar-years > span {
  margin: 1px 5px;
  display: inline-block;
  width: 60px;
  line-height: 30px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid #fbfbfb;
  color: #999;
}
.calendar-years > span.active {
  border: 1px solid #5e7a88;
  background-color: #5e7a88;
  color: #fff;
}
</style>

<template>
  <div style="display:flex;justity-content: s">
    <div class="calendar">
      <div class="calendar-tools">
        <span class="calendar-prev" @click="prev">
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g class="transform-group">
              <g transform="scale(0.015625, 0.015625)">
                <path
                  d="M671.968 912c-12.288 0-24.576-4.672-33.952-14.048L286.048 545.984c-18.752-18.72-18.752-49.12 0-67.872l351.968-352c18.752-18.752 49.12-18.752 67.872 0 18.752 18.72 18.752 49.12 0 67.872l-318.016 318.048 318.016 318.016c18.752 18.752 18.752 49.12 0 67.872C696.544 907.328 684.256 912 671.968 912z"
                  fill="#5e7a88"
                ></path>
              </g>
            </g>
          </svg>
        </span>
        <span class="calendar-next" @click="next">
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g class="transform-group">
              <g transform="scale(0.015625, 0.015625)">
                <path
                  d="M761.056 532.128c0.512-0.992 1.344-1.824 1.792-2.848 8.8-18.304 5.92-40.704-9.664-55.424L399.936 139.744c-19.264-18.208-49.632-17.344-67.872 1.888-18.208 19.264-17.376 49.632 1.888 67.872l316.96 299.84-315.712 304.288c-19.072 18.4-19.648 48.768-1.248 67.872 9.408 9.792 21.984 14.688 34.56 14.688 12 0 24-4.48 33.312-13.44l350.048-337.376c0.672-0.672 0.928-1.6 1.6-2.304 0.512-0.48 1.056-0.832 1.568-1.344C757.76 538.88 759.2 535.392 761.056 532.128z"
                  fill="#5e7a88"
                ></path>
              </g>
            </g>
          </svg>
        </span>
        <div class="calendar-info" @click.stop="changeYear">
          <!-- {{monthString}} -->
          <div class="month">
            <div :style="{'top':-(this.month*20)+'px'}" class="month-inner">
              <span v-for="m in months" :key="m">{{ m }}</span>
            </div>
          </div>
          <div class="year">{{ year }}</div>
        </div>
      </div>
      <table cellpadding="5">
        <thead>
          <tr>
            <td v-for="week in weeks" :key="week" class="week">{{ week }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day,k1) in days" :key="k1">
            <td
              v-for="(child,k2) in day"
              :key="k2"
              :class="{'selected':child.selected,'disabled':child.disabled}"
              @click="select(k1,k2)"
            >
              <span
                :class="{'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}"
                :style="{border:today==child?'solid 2px #5e7a88':''}"
              >{{ child.day }}</span>
              <div v-if="child.eventName!=undefined" class="text">{{ child.eventName }}</div>
              <!-- <div
                v-if="lunar"
                :class="{'isLunarFestival':child.isLunarFestival,'isGregorianFestival':child.isGregorianFestival}"
                class="text"
              >{{ child.lunar }}</div>-->
            </td>
          </tr>
        </tbody>
      </table>
      <div :class="{'show':yearsShow}" class="calendar-years">
        <span
          v-for="y in years"
          :key="y"
          :class="{'active':y==year}"
          @click.stop="selectYear(y)"
        >{{ y }}</span>
      </div>
    </div>
    <div class="times" v-if="showTime">
      <div class="times-tools">
        <div class="day">{{today?today.day:''}}</div>
        <div class="lunar">{{today?today.lunar:''}}</div>
      </div>
      <div class="time-list">
        <div class="items" v-for="(val,i) in times" :key="i">
          <span :class="val.selected?'selected':''">{{val.time}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import calendar from '@/utils/calendar.js';
export default {
  props: {
    // 默认日期
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 开始选择日期
    begin: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 结束选择日期
    end: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否小于10补零
    zero: {
      type: Boolean,
      default: false
    },
    // 屏蔽的日期
    disabled: {
      type: Array,
      default: function() {
        return [];
      }
    },
    showTime: {
      type: Boolean,
      default: true
    },
    // 是否显示农历
    lunar: {
      type: Boolean,
      default: false
    },
    // 自定义时间
    times: {
      type: Array,
      default: function() {
        // return window.navigator.language.toLowerCase() == 'zh-cn'
        //   ? ['日', '一', '二', '三', '四', '五', '六']
        //   : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return [
          { time: '00:00' },
          { time: '01:00' },
          { time: '02:00' },
          { time: '03:00' },
          { time: '04:00' },
          { time: '05:00' },
          { time: '06:00' },
          { time: '07:00' },
          { time: '08:00' },
          { time: '09:00' },
          { time: '10:00' },
          { time: '11:00' },
          { time: '12:00' },
          { time: '13:00' },
          { time: '14:00' },
          { time: '15:00' },
          { time: '16:00' },
          { time: '17:00' },
          { time: '18:00' },
          { time: '19:00' },
          { time: '20:00' },
          { time: '21:00' },
          { time: '22:00' },
          { time: '23:00' }
        ];
      }
    },
    // 自定义星期名称
    weeks: {
      type: Array,
      default: function() {
        return window.navigator.language.toLowerCase() == 'zh-cn'
          ? ['日', '一', '二', '三', '四', '五', '六']
          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      }
    },
    // 自定义月份
    months: {
      type: Array,
      default: function() {
        return window.navigator.language.toLowerCase() == 'zh-cn'
          ? [
              '一月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '十一月',
              '十二月'
            ]
          : [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December'
            ];
      }
    },
    // 自定义事件
    events: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      years: [],
      yearsShow: false,
      year: 0,
      month: 0,
      day: 0,
      days: [],
      multiDays: [],
      today: '',
      festival: {
        lunar: {
          '1-1': '春节',
          '1-15': '元宵节',
          '2-2': '龙头节',
          '5-5': '端午节',
          '7-7': '七夕节',
          '7-15': '中元节',
          '8-15': '中秋节',
          '9-9': '重阳节',
          '10-1': '寒衣节',
          '10-15': '下元节',
          '12-8': '腊八节',
          '12-23': '祭灶节'
        },
        gregorian: {
          '1-1': '元旦',
          '2-14': '情人节',
          '3-8': '妇女节',
          '3-12': '植树节',
          '4-5': '清明节',
          '5-1': '劳动节',
          '5-4': '青年节',
          '6-1': '儿童节',
          '7-1': '建党节',
          '8-1': '建军节',
          '9-10': '教师节',
          '10-1': '国庆节',
          '12-24': '平安夜',
          '12-25': '圣诞节'
        }
      }
    };
  },
  watch: {
    events() {
      this.render(this.year, this.month);
    },
    value() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const now = new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth();
      this.day = now.getDate();
      this.render(this.year, this.month);
    },
    // 渲染日期
    render(y, m) {
      const firstDayOfMonth = new Date(y, m, 1).getDay(); // 当月第一天
      const lastDateOfMonth = new Date(y, m + 1, 0).getDate(); // 当月最后一天
      const lastDayOfLastMonth = new Date(y, m, 0).getDate(); // 最后一月的最后一天
      this.year = y;
      const seletSplit = this.value;
      let i,
        line = 0,
        temp = [],
        nextMonthPushDays = 1;
      for (i = 1; i <= lastDateOfMonth; i++) {
        const day = new Date(y, m, i).getDay(); // 返回星期几（0～6）
        let k;
        // 第一行
        if (day == 0) {
          temp[line] = [];
        } else if (i == 1) {
          temp[line] = [];
          k = lastDayOfLastMonth - firstDayOfMonth + 1;
          for (let j = 0; j < firstDayOfMonth; j++) {
            // console.log("第一行",lunarYear,lunarMonth,lunarValue,lunarInfo)
            temp[line].push(
              Object.assign(
                { day: k, disabled: true },
                this.getLunarInfo(
                  this.computedPrevYear(),
                  this.computedPrevMonth(true),
                  k
                ),
                this.getEvents(
                  this.computedPrevYear(),
                  this.computedPrevMonth(true),
                  k
                )
              )
            );
            k++;
          }
        }
        const options = Object.assign(
          { day: i },
          this.getLunarInfo(this.year, this.month + 1, i),
          this.getEvents(this.year, this.month + 1, i)
        );
        // 标记已选择的日期
        if (this.value.length > 0) {
          for (let k in this.value) {
            const tempTime = Number(new Date(this.year, this.month, i));
            const beginTime = Number(new Date(this.value[k].beginTime));
            const endTime = Number(new Date(this.value[k].endTime));
            if (tempTime > beginTime - 3600 * 24 * 1000 && tempTime < endTime) {
              options.selected = true;
            }
          }
        }
        // 当前选中日期
        if (i == this.day) {
          this.today = options;
          this.renderTimes(options.day);
        }
        // 最小时间设置
        if (this.begin.length > 0) {
          const beginTime = Number(
            new Date(
              parseInt(this.begin[0]),
              parseInt(this.begin[1]) - 1,
              parseInt(this.begin[2])
            )
          );
          if (beginTime > Number(new Date(this.year, this.month, i)))
            options.disabled = true;
        }
        // 最大时间设置
        if (this.end.length > 0) {
          const endTime = Number(
            new Date(
              parseInt(this.end[0]),
              parseInt(this.end[1]) - 1,
              parseInt(this.end[2])
            )
          );
          if (endTime < Number(new Date(this.year, this.month, i)))
            options.disabled = true;
        }
        if (this.disabled.length > 0) {
          if (
            this.disabled.filter(v => {
              return (
                this.year === v[0] && this.month === v[1] - 1 && i === v[2]
              );
            }).length > 0
          ) {
            options.disabled = true;
          }
        }
        temp[line].push(options);
        // 到周六换行
        if (day == 6 && i < lastDateOfMonth) {
          line++;
        } else if (i == lastDateOfMonth) {
          // line++
          let k = 1;
          for (let d = day; d < 6; d++) {
            // console.log(this.computedNextYear()+"-"+this.computedNextMonth(true)+"-"+k)
            temp[line].push(
              Object.assign(
                { day: k, disabled: true },
                this.getLunarInfo(
                  this.computedNextYear(),
                  this.computedNextMonth(true),
                  k
                ),
                this.getEvents(
                  this.computedNextYear(),
                  this.computedNextMonth(true),
                  k
                )
              )
            );
            k++;
          }
          // 下个月除了补充的前几天开始的日期
          nextMonthPushDays = k;
        }
      }
      // console.log(this.year+"/"+this.month+"/"+this.day+":"+line)
      // 补充第六行让视觉稳定
      if (line <= 5 && nextMonthPushDays > 0) {
        // console.log({nextMonthPushDays:nextMonthPushDays,line:line})
        for (let i = line + 1; i <= 5; i++) {
          temp[i] = [];
          const start = nextMonthPushDays + (i - line - 1) * 7;
          for (let d = start; d <= start + 6; d++) {
            temp[i].push(
              Object.assign(
                { day: d, disabled: true },
                this.getLunarInfo(
                  this.computedNextYear(),
                  this.computedNextMonth(true),
                  d
                ),
                this.getEvents(
                  this.computedNextYear(),
                  this.computedNextMonth(true),
                  d
                )
              )
            );
          }
        }
      }
      this.days = temp;
    },

    // 渲染时间
    renderTimes(day) {
      // console.log(this.year, this.month, day);
      if (this.value.length > 0) {
        let data = '';
        for (let k in this.value) {
          let tempTime = Number(
            new Date(this.year, this.month, day, 23, 59, 59)
          );
          let beginTime = Number(new Date(this.value[k].beginTime));
          let endTime = Number(new Date(this.value[k].endTime));
          // console.log(tempTime);
          if (tempTime >= beginTime && tempTime <= endTime + 3600 * 24 * 1000) {
            data = this.value[k];
          }
        }
        // console.log(data);
        if (data) {
          for (let i = 0; i < this.times.length; i++) {
            let tempTime = Number(
              new Date(this.year, this.month, day, i, 59, 59)
            );
            let beginTime = Number(new Date(data.beginTime));
            let endTime = Number(new Date(data.endTime));
            // console.log(tempTime);
            if (tempTime >= beginTime && tempTime <= endTime) {
              this.times[i].selected = true;
            } else {
              this.times[i].selected = false;
            }
          }
        } else {
          for (let i = 0; i < this.times.length; i++) {
            this.times[i].selected = false;
          }
        }
      }
    },

    computedPrevYear() {
      let value = this.year;
      if (this.month - 1 < 0) {
        value--;
      }
      return value;
    },
    computedPrevMonth(isString) {
      let value = this.month;
      if (this.month - 1 < 0) {
        value = 11;
      } else {
        value--;
      }
      // 用于显示目的（一般月份是从0开始的）
      if (isString) {
        return value + 1;
      }
      return value;
    },
    computedNextYear() {
      let value = this.year;
      if (this.month + 1 > 11) {
        value++;
      }
      return value;
    },
    computedNextMonth(isString) {
      let value = this.month;
      if (this.month + 1 > 11) {
        value = 0;
      } else {
        value++;
      }
      // 用于显示目的（一般月份是从0开始的）
      if (isString) {
        return value + 1;
      }
      return value;
    },
    // 获取农历信息
    getLunarInfo(y, m, d) {
      const lunarInfo = calendar.solar2lunar(y, m, d);
      let lunarValue = lunarInfo.IDayCn;
      // console.log(lunarInfo)
      let isLunarFestival = false;
      let isGregorianFestival = false;
      if (
        this.festival.lunar[lunarInfo.lMonth + '-' + lunarInfo.lDay] !=
        undefined
      ) {
        lunarValue = this.festival.lunar[
          lunarInfo.lMonth + '-' + lunarInfo.lDay
        ];
        isLunarFestival = true;
      } else if (this.festival.gregorian[m + '-' + d] != undefined) {
        lunarValue = this.festival.gregorian[m + '-' + d];
        isGregorianFestival = true;
      }
      return {
        lunar: lunarValue,
        isLunarFestival: isLunarFestival,
        isGregorianFestival: isGregorianFestival
      };
    },
    // 获取自定义事件
    getEvents(y, m, d) {
      if (Object.keys(this.events).length == 0) return false;
      const eventName = this.events[y + '-' + m + '-' + d];
      const data = {};
      if (eventName != undefined) {
        data.eventName = eventName;
      }
      return data;
    },
    // 上月
    prev(e) {
      e.stopPropagation();
      if (this.month == 0) {
        this.month = 11;
        this.year = parseInt(this.year) - 1;
      } else {
        this.month = parseInt(this.month) - 1;
      }
      this.render(this.year, this.month);
      this.$emit('selectMonth', this.month + 1, this.year);
      this.$emit('prev', this.month + 1, this.year);
    },
    //  下月
    next(e) {
      e.stopPropagation();
      if (this.month == 11) {
        this.month = 0;
        this.year = parseInt(this.year) + 1;
      } else {
        this.month = parseInt(this.month) + 1;
      }
      this.render(this.year, this.month);
      this.$emit('selectMonth', this.month + 1, this.year);
      this.$emit('next', this.month + 1, this.year);
    },
    // 选中日期
    select(k1, k2) {
      this.today = this.days[k1][k2];
      this.renderTimes(this.days[k1][k2].day);
    },
    changeYear() {
      if (this.yearsShow) {
        this.yearsShow = false;
        return false;
      }
      this.yearsShow = true;
      this.years = [];
      for (let i = ~~this.year - 10; i < ~~this.year + 10; i++) {
        this.years.push(i);
      }
    },
    selectYear(value) {
      this.yearsShow = false;
      this.year = value;
      this.render(this.year, this.month);
      this.$emit('selectYear', value);
    },
    // 返回今天
    setToday() {
      const now = new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth();
      this.day = now.getDate();
      this.render(this.year, this.month);
      // 遍历当前日找到选中
      this.days.forEach(v => {
        const day = v.find(vv => {
          return vv.day == this.day && !vv.disabled;
        });
        if (day != undefined) {
          day.selected = true;
        }
      });
    },
    // 日期补零
    zeroPad(n) {
      return String(n < 10 ? '0' + n : n);
    }
  }
};
</script>
