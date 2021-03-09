// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const moment = require("moment");
const db = cloud.database();
const _ = db.command;


// 云函数入口函数
exports.main = async (event, context) => {
  if (process.env.SWITCH === 'OFF') {
    return;
  }

  moment.locale("zh-cn");
  let a = Math.round(Math.random() * 5) + 1;
  let b = Math.round(Math.random() * 5) + 1;

  let date = new Date();
  let dateFmt = moment(date).format("YYYY-MM-DD HH:mm:ss SSS");
  let year = date.getFullYear();
  let mon = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  let milSec = date.getMilliseconds();
  
  //修正时间，因为正常时59s的时候会触发，但是实际测试有到下一分钟才触发，
  //因此需要规避两种情况，1）已经到下一分钟，2）已经到下一天
  if (sec != 59) {
    min = min;
    //跨天需要处理下，只是跨小时不用处理，因为不影响计算结果
    if (min === 0 && hour === 0) {
      min = 60;
      hour = 23;
      //day - 1
      let timestamp = date.getTime();
      timestamp = timestamp - 60;
      let dateTemp = new Date(timestamp);
      let day = dateTemp.getDate();
    }
  } else {
    min = min + 1;
  }
  min = (sec === 59) ? min + 1 : min;
  let qi = (date.getHours() * 60 + min).toString().padStart(4, "0");
  let dateFmtQi = Number((moment(date).format("YYYYMMDD") + qi));
  let result = a + b;
  let resultDes = result > 6 ? '大' : '小';

  //console.log(`dateFmt = ${dateFmt}, a = ${a}, b = ${b}, resultDesc = ${resultDesc} dateFmtQi = ${dateFmtQi}`);
  //更新状态
  try {
    if (Number(qi) + 1 === 1440) {

    }
    date.tom
    db.collection('status').doc('todo-status-info').update({
      data: {
        isDoneJieSuan: false,
        numCurQi: qi
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        //console.log("res: ", res);
      }
    });
  } catch (error) {
    console.error(error);
  }

  try {
    db.collection(`dataResult_${moment(date).format("YYYYMMDD")}`).add({
      data: {
        _id: dateFmtQi,
        time: dateFmt,
        qi: dateFmtQi,
        val1: a,
        val2: b,
        result,
        resultDes
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        //console.log("res: ", res);
      }
    });
  } catch (error) {
    console.error(error);
  }


}

