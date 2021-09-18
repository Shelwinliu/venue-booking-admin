var moment = require('moment');
moment().format();

export default function getWeek(currentMonth, currentDay) {
  const year = new Date().getFullYear()
  let week = 0;

  if(currentMonth >= 10 && currentDay >= 10)
        week = moment(`${year}-${currentMonth}-${currentDay}`).day()
   else if(currentMonth >= 10 && currentDay < 10)
        week = moment(`${year}-${currentMonth}-0${currentDay}`).day()
   else if(currentMonth < 10 && currentDay >= 10)
        week = moment(`${year}-0${currentMonth}-${currentDay}`).day()
   else if(currentMonth < 10 && currentDay < 10)
        week = moment(`${year}-0${currentMonth}-0${currentDay}`).day()

        let str = ''
        switch (week) {
        case 0 :
                str += "日";
                break;
        case 1 :
                str += "一";
                break;
        case 2 :
                str += "二";
                break;
        case 3 :
                str += "三";
                break;
        case 4 :
                str += "四";
                break;
        case 5 :
                str += "五";
                break;
        case 6 :
                str += "六";
                break;
    }

        return str
}
