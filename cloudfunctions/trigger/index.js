// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const moment = require("moment");
const db = cloud.database();
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  moment.locale("zh-cn");
  let a = Math.round(Math.random() * 5) + 1;
  let b = Math.round(Math.random() * 5) + 1;

  let date = new Date();
  let dateFmt = moment(date).format("YYYY-MM-DD HH:mm:ss SSS");
  let qi = (date.getHours() * 60 + date.getMinutes() + 1).toString().padStart(4, "0");
  let dateFmtQi = Number((moment(date).format("YYYYMMDD") + qi));
  let result = a + b;
  let resultDesc = result > 6 ? '大' : '小';
  console.log(`dateFmt = ${dateFmt}, a = ${a}, b = ${b}, resultDesc = ${resultDesc} dateFmtQi = ${dateFmtQi}`);

  db.collection('dataResult').add({
    data: {
      _id: dateFmtQi,
      time: dateFmt,
      qi: dateFmtQi,
      val1: a,
      val2: b,
      result,
      resultDesc
    },
    success: function(res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log("res: ", res);
    }
  });

}

