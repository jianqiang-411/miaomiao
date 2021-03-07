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
  let min = date.getMinutes();
  let sec = date.getSeconds();
  min = (sec === 59) ? min + 1 : min;
  let qi = (date.getHours() * 60 + min).toString().padStart(4, "0");
  let dateFmtQi = Number((moment(date).format("YYYYMMDD") + qi));
  let result = a + b;
  let resultDes = result > 6 ? '大' : '小';

  //console.log(`dateFmt = ${dateFmt}, a = ${a}, b = ${b}, resultDesc = ${resultDesc} dateFmtQi = ${dateFmtQi}`);
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

